import { Day } from "../common/day";

type Coord = [x: number, y: number];

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
    grid: string[][],
    guardCoords: Coord,
    visited: Map<number, Map<number, Set<Heading>>>
  ): WalkResult {
    const heading = grid[guardCoords[1]][guardCoords[0]];
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

    grid[guardCoords[1]][guardCoords[0]] = ".";
    const charAtNewCoords: string | undefined =
      grid[newCoords[1]]?.[newCoords[0]];
    if (!charAtNewCoords) return { newCoords: null, result: Results.Complete };

    if (charAtNewCoords === "#") {
      const newHeading = this.rotate(heading);
      grid[guardCoords[1]][guardCoords[0]] = newHeading;
      if (visited.get(guardCoords[0])?.get(guardCoords[1])?.has(newHeading)) {
        return { newCoords, result: Results.Loop };
      }

      this.addToVisited(visited, guardCoords, newHeading);
      return { newCoords: guardCoords, result: Results.InProgress };
    }

    if (charAtNewCoords !== ".") {
      throw new Error(`Unexpected grid value: ${charAtNewCoords}`);
    }

    grid[newCoords[1]][newCoords[0]] = heading;

    if (visited.get(newCoords[0])?.get(newCoords[1])?.has(heading)) {
      return { newCoords, result: Results.Loop };
    }

    this.addToVisited(visited, newCoords, heading);
    return { newCoords, result: Results.InProgress };
  }

  private findGuard(grid: string[][]): Coord {
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        const char = row[x];
        if ((Object.values(Headings) as string[]).includes(char)) {
          return [x, y];
        }
      }
    }

    throw new Error("Could not find guard!");
  }

  private print(grid: string[][]) {
    for (let y = grid.length - 1; y >= 0; y--) {
      console.log(grid[y].join(""));
    }
    console.log(" ");
  }

  private doTheThing(
    visited: Map<number, Map<number, Set<Heading>>>,
    grid: string[][],
    guardCoords: Coord
  ) {
    // this.print(grid);
    let result: Result = Results.InProgress;
    while (result === Results.InProgress) {
      const walkResult = this.walk(grid, guardCoords, visited);
      result = walkResult.result;

      if (walkResult.result !== Results.InProgress) break;
      guardCoords = walkResult.newCoords;
      // this.print(grid);
    }

    return result;
  }

  private formsLoop(
    grid: string[][],
    obstacleCoord: Coord,
    guardCoord: Coord
  ): boolean {
    grid[obstacleCoord[1]][obstacleCoord[0]] = "#";

    const visited = new Map<number, Map<number, Set<Heading>>>();
    return this.doTheThing(visited, grid, guardCoord) === Results.Loop;
  }

  private cloneGrid(grid: string[][]) {
    return [...grid.map((x) => [...x])];
  }

  protected override part1(input: string): string {
    const grid = input
      .split("\n")
      .map((x) => x.split(""))
      .reverse();

    let guardCoords = this.findGuard(grid);
    const visited = new Map<number, Map<number, Set<Heading>>>();
    this.doTheThing(visited, grid, guardCoords);

    return Array.from(visited.values())
      .reduce((acc, curr) => acc + curr.size, 0)
      .toString();
  }

  protected override part2(input: string): string {
    const grid = input
      .split("\n")
      .map((x) => x.split(""))
      .reverse();
    this.print(grid);

    const guardCoord = this.findGuard(grid);

    let numLoops = 0;
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      for (let x = 0; x < row.length; x++) {
        if ((x === guardCoord[0] && y === guardCoord[1]) || grid[y][x] === "#")
          continue;

        numLoops += this.formsLoop(this.cloneGrid(grid), [x, y], guardCoord)
          ? 1
          : 0;
      }
    }

    return numLoops.toString();
  }
}
