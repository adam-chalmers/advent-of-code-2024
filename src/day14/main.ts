import { Day } from "../common/day";
import { Grid } from "../common/grid/grid";
import { Point } from "../common/grid/point";
import { PointMap } from "../common/grid/pointMap";
import { PointSet } from "../common/grid/pointSet";

interface Robot {
  position: Point;
  velocity: Point;
}

export class Day14 extends Day {
  private readonly GRID_HEIGHT = 103;
  private readonly GRID_WIDTH = 101;

  protected getDir(): string {
    return __dirname;
  }

  private parse(input: string) {
    const lines = input.split("\n");
    const robots: Robot[] = [];
    for (const line of lines) {
      const [position, velocity] = line.split(" ").map((x) => {
        const a = x.slice(2);
        const b = a.split(",");
        const c = b.map((y) => Number.parseInt(y)) as [number, number];
        return c;
      });
      robots.push({ position: Point.fromTuple(position), velocity: Point.fromTuple(velocity) });
    }

    return robots;
  }

  private getQuadMultiple(points: Point[]) {
    let topLeft = 0;
    let topRight = 0;
    let bottomLeft = 0;
    let bottomRight = 0;
    const midWidth = (this.GRID_WIDTH - 1) / 2;
    const midHeight = (this.GRID_HEIGHT - 1) / 2;
    for (const position of points) {
      if (position.x === midWidth || position.y === midHeight) continue;

      if (position.x < midWidth) {
        if (position.y < midHeight) {
          bottomLeft++;
        } else {
          topLeft++;
        }
      } else {
        if (position.y < midHeight) {
          bottomRight++;
        } else {
          topRight++;
        }
      }
    }

    return bottomLeft * topLeft * bottomRight * topRight;
  }

  protected override part1(input: string): string {
    const robots = this.parse(input);
    const finalPositions: Point[] = [];
    for (const robot of robots) {
      let finalX = (robot.position.x + robot.velocity.x * 100) % this.GRID_WIDTH;
      if (finalX < 0) {
        finalX += this.GRID_WIDTH;
      }
      let finalY = (robot.position.y + robot.velocity.y * 100) % this.GRID_HEIGHT;
      if (finalY < 0) {
        finalY += this.GRID_HEIGHT;
      }
      finalPositions.push(new Point(finalX, finalY));
    }

    return this.getQuadMultiple(finalPositions).toString();
  }

  private addAdjacentPoints(point: Point, robotMap: PointMap<Robot[]>, visited: PointSet, set: Point[] = []) {
    for (const neighbour of [point.down(), point.up(), point.left(), point.right()]) {
      if (
        visited.has(neighbour) ||
        neighbour.x < 0 ||
        neighbour.x >= this.GRID_WIDTH ||
        neighbour.y < 0 ||
        neighbour.y >= this.GRID_HEIGHT
      ) {
        continue;
      }

      visited.add(neighbour);
      const neighbourRobots = robotMap.get(neighbour);
      if (neighbourRobots) {
        set.push(neighbour);
        this.addAdjacentPoints(neighbour, robotMap, visited, set);
      }
    }

    return set;
  }

  private getAdjacencySets(robotMap: PointMap<Robot[]>): Point[][] {
    const sets: Point[][] = [];
    const visited = new PointSet();
    for (const point of robotMap.keys()) {
      if (visited.has(point)) continue;

      visited.add(point);
      sets.push(this.addAdjacentPoints(point, robotMap, visited, [point]));
    }

    return sets;
  }

  protected override part2(input: string): string {
    const robots = this.parse(input);
    let minSets = Number.POSITIVE_INFINITY;
    let minSetsIteration = 0;
    for (let i = 0; i < this.GRID_HEIGHT * this.GRID_WIDTH; i++) {
      const robotMap = new PointMap<Robot[]>();
      for (const robot of robots) {
        robotMap.ensure(robot.position, () => []).push(robot);
      }

      const sets = this.getAdjacencySets(robotMap);
      if (sets.length < minSets) {
        minSets = sets.length;
        minSetsIteration = i;
        const grid = new Array(this.GRID_HEIGHT).fill(undefined).map((x) => new Array<string>(this.GRID_WIDTH).fill(" "));
        for (const robot of robots) {
          grid[robot.position.y][robot.position.x] = "#";
        }
      }

      for (const robot of robots) {
        robot.position = new Point(
          (this.GRID_WIDTH + robot.position.x + robot.velocity.x) % this.GRID_WIDTH,
          (this.GRID_HEIGHT + robot.position.y + robot.velocity.y) % this.GRID_HEIGHT
        );
      }
    }

    return minSetsIteration.toString();
  }
}
