import { Day } from "../common/day";

export class Day4 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private parse(input: string) {
    const grid: string[][] = [];
    const lines = input.split("\n");
    for (const line of lines) {
      const gridLine = line.split("");
      grid.push(gridLine);
    }

    return grid;
  }

  private findCoords(grid: string[][], char: string) {
    const coords: [x: number, y: number][] = [];
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] == char) {
          coords.push([x, y]);
        }
      }
    }

    return coords;
  }

  protected override part1(input: string): string {
    const grid = this.parse(input);
    const xCoords = this.findCoords(grid, "X");

    let count = 0;
    for (const [x, y] of xCoords) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            grid[y + i]?.[x + j] === "M" &&
            grid[y + i * 2]?.[x + j * 2] === "A" &&
            grid[y + i * 3]?.[x + j * 3] === "S"
          ) {
            count++;
          }
        }
      }
    }

    return count.toString();
  }

  protected override part2(input: string): string {
    const grid = this.parse(input);
    const aCoords = this.findCoords(grid, "A");

    let count = 0;
    for (const [x, y] of aCoords) {
      const isForwards =
        (grid[y - 1]?.[x - 1] === "M" && grid[y + 1]?.[x + 1] === "S") ||
        (grid[y + 1]?.[x + 1] === "M" && grid[y - 1]?.[x - 1] === "S");
      const isBackwards =
        (grid[y + 1]?.[x - 1] === "M" && grid[y - 1]?.[x + 1] === "S") ||
        (grid[y - 1]?.[x + 1] === "M" && grid[y + 1]?.[x - 1] === "S");
      if (isForwards && isBackwards) {
        count++;
      }
    }

    return count.toString();
  }
}
