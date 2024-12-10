import { Day } from "../common/day";
import { Grid } from "../common/grid/grid";
import { Point } from "../common/grid/point";
import { PointSet } from "../common/grid/pointSet";

export class Day10 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private parseGrid(input: string): Grid<number> {
    return new Grid<number>({
      grid: input
        .split("\n")
        .map((x) => x.split("").map((y) => Number.parseInt(y)))
        .reverse(),
    });
  }

  private findTrails(grid: Grid<number>, position: Point, target: number, reached?: PointSet): number {
    const nextPoints = [
      new Point(position.x - 1, position.y),
      new Point(position.x + 1, position.y),
      new Point(position.x, position.y - 1),
      new Point(position.x, position.y + 1),
    ];

    let sum = 0;
    for (const nextPoint of nextPoints) {
      const gridValue = grid.tryGet(nextPoint);
      if (gridValue === undefined || gridValue !== target) {
        continue;
      }

      if (gridValue === 9) {
        if (!reached) {
          sum++;
          continue;
        }

        if (!reached.has(nextPoint)) {
          sum++;
          reached.add(nextPoint);
          continue;
        }
      } else {
        sum += this.findTrails(grid, nextPoint, target + 1, reached);
      }
    }

    return sum;
  }

  protected override part1(input: string): string {
    const grid = this.parseGrid(input);

    let sum = 0;
    for (const { point, value } of grid) {
      if (value !== 0) continue;
      sum += this.findTrails(grid, point, 1, new PointSet());
    }

    return sum.toString();
  }

  protected override part2(input: string): string {
    const grid = this.parseGrid(input);

    let sum = 0;
    for (const { point, value } of grid) {
      if (value !== 0) continue;
      sum += this.findTrails(grid, point, 1);
    }

    return sum.toString();
  }
}
