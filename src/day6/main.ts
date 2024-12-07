import { Day } from "../common/day";
import { Coord, Grid } from "../common/grid";

const Headings = {
  UP: "^",
  DOWN: "v",
  LEFT: "<",
  RIGHT: ">",
} as const;
type Heading = (typeof Headings)[keyof typeof Headings];

const Results = {
  InProgress: 0,
  Complete: 1,
  Loop: 2,
} as const;
type Result = (typeof Results)[keyof typeof Results];

type WalkResult =
  | { newCoords: Coord; result: typeof Results.InProgress }
  | { newCoords: null; result: typeof Results.Complete }
  | { newCoords: Coord; result: typeof Results.Loop };

type Visited = Record<number, Record<number, Set<Heading>>>;

export class Day6 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private rotate(heading: Heading): Heading {
    switch (heading) {
      case Headings.UP:
        return Headings.RIGHT;
      case Headings.DOWN:
        return Headings.LEFT;
      case Headings.LEFT:
        return Headings.UP;
      case Headings.RIGHT:
        return Headings.DOWN;
      default:
        throw new Error(`Invalid heading: ${heading}`);
    }
  }

  private addToVisited(visited: Visited, coords: Coord, heading: Heading) {
    let existingX = visited[coords[0]];
    if (!existingX) {
      existingX = {};
      visited[coords[0]] = existingX;
    }
    let existingY = existingX[coords[1]];
    if (!existingY) {
      existingY = new Set();
      existingX[coords[1]] = existingY;
    }
    existingY.add(heading);
  }

  private walk(grid: Grid, guardCoords: Coord, visited: Visited): WalkResult {
    const heading = grid.get(guardCoords);
    let newCoords: Coord;
    if (heading === Headings.UP)
      newCoords = [guardCoords[0], guardCoords[1] + 1];
    else if (heading === Headings.DOWN)
      newCoords = [guardCoords[0], guardCoords[1] - 1];
    else if (heading === Headings.LEFT)
      newCoords = [guardCoords[0] - 1, guardCoords[1]];
    else if (heading === Headings.RIGHT)
      newCoords = [guardCoords[0] + 1, guardCoords[1]];
    else
      throw new Error(
        `Guard is not at position! (${guardCoords[0]}, ${guardCoords[1]})`
      );

    grid.set(guardCoords, ".");
    const charAtNewCoords = grid.tryGet(newCoords);
    if (!charAtNewCoords) return { newCoords: null, result: Results.Complete };

    if (charAtNewCoords === "#") {
      const newHeading = this.rotate(heading);
      grid.set(guardCoords, newHeading);
      if (visited[guardCoords[0]]?.[guardCoords[1]]?.has(newHeading)) {
        return { newCoords: guardCoords, result: Results.Loop };
      }

      this.addToVisited(visited, guardCoords, newHeading);
      return { newCoords: guardCoords, result: Results.InProgress };
    }

    if (charAtNewCoords !== ".") {
      throw new Error(`Unexpected grid value: ${charAtNewCoords}`);
    }

    grid.set(newCoords, heading);

    if (visited[newCoords[0]]?.[newCoords[1]]?.has(heading)) {
      return { newCoords, result: Results.Loop };
    }

    this.addToVisited(visited, newCoords, heading);
    return { newCoords, result: Results.InProgress };
  }

  private findGuard(grid: Grid): Coord {
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const char = grid.get(x, y);
        if ((Object.values(Headings) as string[]).includes(char)) {
          return [x, y];
        }
      }
    }

    throw new Error("Could not find guard!");
  }

  private walkUntilDone(visited: Visited, grid: Grid, guardCoords: Coord) {
    visited[guardCoords[0]] = {
      [guardCoords[1]]: new Set([grid.get(guardCoords) as Heading]),
    };
    let result: Result = Results.InProgress;
    while (result === Results.InProgress) {
      const walkResult = this.walk(grid, guardCoords, visited);
      result = walkResult.result;

      if (walkResult.result !== Results.Complete) {
        guardCoords = walkResult.newCoords;
      }
    }

    return { result, finalGuardCoords: guardCoords };
  }

  private checkLoop(grid: Grid, obstacleCoord: Coord, guardCoord: Coord) {
    grid.set(obstacleCoord, "#");

    const visited: Visited = {};
    return this.walkUntilDone(visited, grid, guardCoord);
  }

  protected override part1(input: string): string {
    const grid = Grid.fromInput({ input });

    const guardCoords = this.findGuard(grid);
    const visited: Visited = {};
    this.walkUntilDone(visited, grid, guardCoords);

    return Object.values(visited)
      .reduce((acc, curr) => acc + Object.keys(curr).length, 0)
      .toString();
  }

  protected override part2(input: string): string {
    const grid = Grid.fromInput({ input });

    const guardCoords = this.findGuard(grid);
    const originalHeading = grid.get(guardCoords);
    const visited: Visited = {};
    this.walkUntilDone(visited, grid, guardCoords);
    grid.reset();

    const loopCoords = new Set<string>();
    for (const [x, yCoords] of Object.entries(visited)) {
      for (const [y, headings] of Object.entries(yCoords)) {
        for (const heading of headings) {
          let obstacle: Coord;
          switch (heading) {
            case Headings.UP:
              obstacle = [Number(x), Number(y) + 1];
              break;
            case Headings.DOWN:
              obstacle = [Number(x), Number(y) - 1];
              break;
            case Headings.LEFT:
              obstacle = [Number(x) - 1, Number(y)];
              break;
            case Headings.RIGHT:
              obstacle = [Number(x) + 1, Number(y)];
              break;
          }
          if (
            obstacle[0] < 0 ||
            obstacle[0] >= grid.width ||
            obstacle[1] < 0 ||
            obstacle[1] >= grid.height ||
            (obstacle[0] === guardCoords[0] &&
              obstacle[1] === guardCoords[1]) ||
            grid.get(obstacle) === "#"
          ) {
            continue;
          }

          const { result, finalGuardCoords } = this.checkLoop(
            grid,
            obstacle,
            guardCoords
          );
          if (result === Results.Loop) {
            loopCoords.add(`${obstacle[0]},${obstacle[1]}`);
          }
          grid.set(finalGuardCoords, ".");
          grid.set(obstacle, ".");
          grid.set(guardCoords, originalHeading);
        }
      }
    }

    return loopCoords.size.toString();
  }
}

new Day6().run({ example: false, part: 2 });
