import { Day } from "../common/day";
import { Grid } from "../common/grid/grid";
import { Point } from "../common/grid/point";
import { PointSet } from "../common/grid/pointSet";

export class Day8 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private getAntennas(grid: Grid) {
    const antennas = new Map<string, Point[]>();
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const char = grid.get(x, y);
        if (char === ".") continue;

        let existing = antennas.get(char);
        if (!existing) {
          existing = [];
          antennas.set(char, existing);
        }
        existing.push(new Point(x, y));
      }
    }

    return antennas;
  }

  private getAntinodes(grid: Grid, antennas: Map<string, Point[]>, p2Logic: boolean) {
    const antinodes: Point[] = [];
    for (const [char, coords] of antennas) {
      if (coords.length <= 1) continue;

      for (let i = 0; i < coords.length - 1; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const first = coords[i];
          const second = coords[j];
          const xDiff = first.x - second.x;
          const yDiff = first.y - second.y;

          let curX = p2Logic ? first.x : first.x + xDiff;
          let curY = p2Logic ? first.y : first.y + yDiff;
          while (grid.inBounds(curX, curY)) {
            antinodes.push(new Point(curX, curY));
            if (!p2Logic) break;

            curX += xDiff;
            curY += yDiff;
          }

          curX = p2Logic ? second.x : second.x - xDiff;
          curY = p2Logic ? second.y : second.y - yDiff;
          while (grid.inBounds(curX, curY)) {
            antinodes.push(new Point(curX, curY));
            if (!p2Logic) break;

            curX -= xDiff;
            curY -= yDiff;
          }
        }
      }
    }

    return antinodes;
  }

  protected override part1(input: string): string {
    const grid = Grid.fromInput({ input });
    const antennas = this.getAntennas(grid);

    const antinodes = this.getAntinodes(grid, antennas, false);
    return new PointSet(antinodes).size.toString();
  }

  protected override part2(input: string): string {
    const grid = Grid.fromInput({ input });
    const antennas = this.getAntennas(grid);

    const antinodes = this.getAntinodes(grid, antennas, true);
    return new PointSet(antinodes).size.toString();
  }
}
