import { Day } from "../common/day";
import { Grid } from "../common/grid/grid";
import { Point } from "../common/grid/point";
import { PointMap } from "../common/grid/pointMap";
import { PointSet } from "../common/grid/pointSet";

export class Day12 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private getRegion(grid: Grid, point: Point, plant: string, visited: PointSet = new PointSet(), region: Point[] = []) {
    region.push(point);
    visited.add(point);

    const neighbours = [point.left(), point.right(), point.up(), point.down()];
    for (const neighbour of neighbours) {
      if (visited.has(neighbour)) continue;

      if (grid.tryGet(neighbour) === plant) {
        this.getRegion(grid, neighbour, plant, visited, region);
      }
    }

    return region;
  }

  private getRegions(grid: Grid) {
    const allRegions = new Set<Point[]>();
    const visited = new PointSet();
    for (const { point, value } of grid) {
      if (visited.has(point)) continue;

      const region = this.getRegion(grid, point, value);
      allRegions.add(region);
      for (const point of region) {
        visited.add(point);
      }
    }

    return Array.from(allRegions);
  }

  private numCorners(grid: Grid, point: Point): number {
    const value = grid.get(point);

    const up = grid.tryGet(point.up());
    const down = grid.tryGet(point.down());
    const left = grid.tryGet(point.left());
    const right = grid.tryGet(point.right());
    const upLeft = grid.tryGet(point.up().left());
    const upRight = grid.tryGet(point.up().right());
    const downLeft = grid.tryGet(point.down().left());
    const downRight = grid.tryGet(point.down().right());

    let numCorners = 0;
    if (up === value) {
      if (right === value && upRight !== value) numCorners++;
      if (left === value && upLeft !== value) numCorners++;
    } else {
      if (right !== value) numCorners++;
      if (left !== value) numCorners++;
    }

    if (down === value) {
      if (right === value && downRight !== value) numCorners++;
      if (left === value && downLeft !== value) numCorners++;
    } else {
      if (right !== value) numCorners++;
      if (left !== value) numCorners++;
    }

    return numCorners;
  }

  protected override part1(input: string): string {
    const grid = Grid.fromInput({ input });
    const allRegions = this.getRegions(grid);

    let sum = 0;
    for (const region of allRegions) {
      const area = region.length;
      let perimeter = 0;
      for (const point of region) {
        const neighbours = grid.realNeighbours(point);
        for (const neighbour of neighbours) {
          const neighbourValue = grid.get(neighbour);
          if (neighbourValue !== grid.get(point)) {
            perimeter++;
          }
        }
      }

      sum += area * perimeter;
    }

    return sum.toString();
  }

  protected override part2(input: string): string {
    const grid = Grid.fromInput({ input });
    const allRegions = this.getRegions(grid);

    let sum = 0;
    for (const region of allRegions) {
      const area = region.length;
      let corners = 0;
      for (const point of region) {
        corners += this.numCorners(grid, point);
      }

      sum += area * corners;
    }

    return sum.toString();
  }
}
