import { Day } from "../common/day";
import { Grid } from "../common/grid";

export class Day4 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private findCoords(grid: Grid, char: string) {
    const coords: [x: number, y: number][] = [];
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (grid.get(x, y) == char) {
          coords.push([x, y]);
        }
      }
    }

    return coords;
  }

  protected override part1(input: string): string {
    const grid = Grid.fromInput({ input });
    const xCoords = this.findCoords(grid, "X");

    let count = 0;
    for (const [x, y] of xCoords) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            grid.tryGet(x + j, y + i) === "M" &&
            grid.tryGet(x + j * 2, y + i * 2) === "A" &&
            grid.tryGet(x + j * 3, y + i * 3) === "S"
          ) {
            count++;
          }
        }
      }
    }

    return count.toString();
  }

  protected override part2(input: string): string {
    const grid = Grid.fromInput({ input });
    const aCoords = this.findCoords(grid, "A");

    let count = 0;
    for (const [x, y] of aCoords) {
      const isForwards =
        (grid.tryGet(x - 1, y - 1) === "M" &&
          grid.tryGet(x + 1, y + 1) === "S") ||
        (grid.tryGet(x + 1, y + 1) === "M" &&
          grid.tryGet(x - 1, y - 1) === "S");
      const isBackwards =
        (grid.tryGet(x - 1, y + 1) === "M" &&
          grid.tryGet(x + 1, y - 1) === "S") ||
        (grid.tryGet(x + 1, y - 1) === "M" &&
          grid.tryGet(x - 1, y + 1) === "S");
      if (isForwards && isBackwards) {
        count++;
      }
    }

    return count.toString();
  }
}
