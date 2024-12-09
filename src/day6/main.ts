import { Day } from "../common/day";
import { Grid } from "../common/grid/grid";
import { Point } from "../common/grid/point";
import { PointMap } from "../common/grid/pointMap";
import { PointSet } from "../common/grid/pointSet";

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
  | { newCoords: Point; result: typeof Results.InProgress }
  | { newCoords: null; result: typeof Results.Complete }
  | { newCoords: Point; result: typeof Results.Loop };

type Visited = PointMap<Set<Heading>>;

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

  private addToVisited(visited: Visited, coords: Point, heading: Heading) {
    visited.ensure(coords, () => new Set());
    visited.get(coords)!.add(heading);
  }

  private walk(grid: Grid, guardCoords: Point, visited: Visited): WalkResult {
    const heading = grid.get(guardCoords);
    let newCoords: Point;
    if (heading === Headings.UP) newCoords = new Point(guardCoords.x, guardCoords.y + 1);
    else if (heading === Headings.DOWN) newCoords = new Point(guardCoords.x, guardCoords.y - 1);
    else if (heading === Headings.LEFT) newCoords = new Point(guardCoords.x - 1, guardCoords.y);
    else if (heading === Headings.RIGHT) newCoords = new Point(guardCoords.x + 1, guardCoords.y);
    else throw new Error(`Guard is not at position! (${guardCoords.x}, ${guardCoords.y})`);

    grid.set(guardCoords, ".");
    const charAtNewCoords = grid.tryGet(newCoords);
    if (!charAtNewCoords) return { newCoords: null, result: Results.Complete };

    if (charAtNewCoords === "#") {
      const newHeading = this.rotate(heading);
      grid.set(guardCoords, newHeading);
      if (visited.get(guardCoords)?.has(newHeading)) {
        return { newCoords: guardCoords, result: Results.Loop };
      }

      this.addToVisited(visited, guardCoords, newHeading);
      return { newCoords: guardCoords, result: Results.InProgress };
    }

    if (charAtNewCoords !== ".") {
      throw new Error(`Unexpected grid value: ${charAtNewCoords}`);
    }

    grid.set(newCoords, heading);

    if (visited.get(newCoords)?.has(heading)) {
      return { newCoords, result: Results.Loop };
    }

    this.addToVisited(visited, newCoords, heading);
    return { newCoords, result: Results.InProgress };
  }

  private findGuard(grid: Grid): Point {
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const char = grid.get(x, y);
        if ((Object.values(Headings) as string[]).includes(char)) {
          return new Point(x, y);
        }
      }
    }

    throw new Error("Could not find guard!");
  }

  private walkUntilDone(visited: Visited, grid: Grid, guardCoords: Point) {
    visited.set(guardCoords, new Set([grid.get(guardCoords) as Heading]));
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

  private checkLoop(grid: Grid, obstacleCoord: Point, guardCoord: Point) {
    grid.set(obstacleCoord, "#");

    const visited = new PointMap<Set<Heading>>();
    return this.walkUntilDone(visited, grid, guardCoord);
  }

  protected override part1(input: string): string {
    const grid = Grid.fromInput({ input });

    const guardCoords = this.findGuard(grid);
    const visited = new PointMap<Set<Heading>>();
    this.walkUntilDone(visited, grid, guardCoords);

    return visited.size.toString();
  }

  protected override part2(input: string): string {
    const grid = Grid.fromInput({ input });

    const guardCoords = this.findGuard(grid);
    const originalHeading = grid.get(guardCoords);
    const visited = new PointMap<Set<Heading>>();
    this.walkUntilDone(visited, grid, guardCoords);
    grid.reset();

    const loopCoords = new PointSet();
    for (const [coords, headings] of visited.entries()) {
      for (const heading of headings) {
        let obstacle: Point;
        switch (heading) {
          case Headings.UP:
            obstacle = new Point(coords.x, coords.y + 1);
            break;
          case Headings.DOWN:
            obstacle = new Point(coords.x, coords.y - 1);
            break;
          case Headings.LEFT:
            obstacle = new Point(coords.x - 1, coords.y);
            break;
          case Headings.RIGHT:
            obstacle = new Point(coords.x + 1, coords.y);
            break;
        }
        if (!grid.inBounds(obstacle) || obstacle.equals(guardCoords) || grid.get(obstacle) === "#") {
          continue;
        }

        const { result, finalGuardCoords } = this.checkLoop(grid, obstacle, guardCoords);
        if (result === Results.Loop) {
          loopCoords.add(obstacle);
        }
        grid.set(finalGuardCoords, ".");
        grid.set(obstacle, ".");
        grid.set(guardCoords, originalHeading);
      }
    }

    return loopCoords.size.toString();
  }
}
