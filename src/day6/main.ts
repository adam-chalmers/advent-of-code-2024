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

  private addToVisited(
    visited: Map<number, Map<number, Set<Heading>>>,
    coords: Coord,
    heading: Heading
  ) {
    let existingX = visited.get(coords[0]);
    if (!existingX) {
      existingX = new Map();
      visited.set(coords[0], existingX);
    }
    let existingY = existingX.get(coords[1]);
    if (!existingY) {
      existingY = new Set();
      existingX.set(coords[1], existingY);
    }
    existingY.add(heading);
  }

  private walk(
    grid: Grid,
    guardCoords: Coord,
    visited: Map<number, Map<number, Set<Heading>>>
  ): WalkResult {
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
      if (visited.get(guardCoords[0])?.get(guardCoords[1])?.has(newHeading)) {
        return { newCoords, result: Results.Loop };
      }

      this.addToVisited(visited, guardCoords, newHeading);
      return { newCoords: guardCoords, result: Results.InProgress };
    }

    if (charAtNewCoords !== ".") {
      throw new Error(`Unexpected grid value: ${charAtNewCoords}`);
    }

    grid.set(newCoords, heading);

    if (visited.get(newCoords[0])?.get(newCoords[1])?.has(heading)) {
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

  private walkUntilDone(
    visited: Map<number, Map<number, Set<Heading>>>,
    grid: Grid,
    guardCoords: Coord
  ) {
    // grid.print();
    let result: Result = Results.InProgress;
    while (result === Results.InProgress) {
      const walkResult = this.walk(grid, guardCoords, visited);
      result = walkResult.result;

      if (walkResult.result !== Results.InProgress) break;
      guardCoords = walkResult.newCoords;
      // grid.print();
    }

    return result;
  }

  private formsLoop(
    grid: Grid,
    obstacleCoord: Coord,
    guardCoord: Coord
  ): boolean {
    grid.set(obstacleCoord, "#");

    const visited = new Map<number, Map<number, Set<Heading>>>();
    return this.walkUntilDone(visited, grid, guardCoord) === Results.Loop;
  }

  protected override part1(input: string): string {
    const grid = Grid.fromInput({ input });

    let guardCoords = this.findGuard(grid);
    const visited = new Map<number, Map<number, Set<Heading>>>();
    this.walkUntilDone(visited, grid, guardCoords);

    return Array.from(visited.values())
      .reduce((acc, curr) => acc + curr.size, 0)
      .toString();
  }

  protected override part2(input: string): string {
    const grid = Grid.fromInput({ input });

    const guardCoord = this.findGuard(grid);

    let numLoops = 0;
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (
          (x === guardCoord[0] && y === guardCoord[1]) ||
          grid.get(x, y) === "#"
        )
          continue;

        numLoops += this.formsLoop(grid, [x, y], guardCoord) ? 1 : 0;
        grid.reset();
      }
    }

    return numLoops.toString();
  }
}
