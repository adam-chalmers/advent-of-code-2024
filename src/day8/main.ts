import { Day } from "../common/day";
import { Coord, Grid } from "../common/grid";

export class Day8 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private getAntennas(grid: Grid) {
    const antennas = new Map<string, Coord[]>();
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const char = grid.get(x, y);
        if (char === ".") continue;

        let existing = antennas.get(char);
        if (!existing) {
          existing = [];
          antennas.set(char, existing);
        }
        existing.push([x, y]);
      }
    }

    return antennas;
  }

  private getAntinodes(grid: Grid, antennas: Map<string, Coord[]>, p2Logic: boolean) {
    const antinodes: Coord[] = [];
    for (const [char, coords] of antennas) {
      if (coords.length <= 1) continue;

      for (let i = 0; i < coords.length - 1; i++) {
        for (let j = i + 1; j < coords.length; j++) {
          const first = coords[i];
          const second = coords[j];
          const xDiff = first[0] - second[0];
          const yDiff = first[1] - second[1];

          let curX = p2Logic ? first[0] : first[0] + xDiff;
          let curY = p2Logic ? first[1] : first[1] + yDiff;
          while (grid.inBounds(curX, curY)) {
            antinodes.push([curX, curY]);
            if (!p2Logic) break;

            curX += xDiff;
            curY += yDiff;
          }

          curX = p2Logic ? second[0] : second[0] - xDiff;
          curY = p2Logic ? second[1] : second[1] - yDiff;
          while (grid.inBounds(curX, curY)) {
            antinodes.push([curX, curY]);
            if (!p2Logic) break;

            curX -= xDiff;
            curY -= yDiff;
          }
        }
      }
    }

    return antinodes;
  }

  private getUniquePositions(coords: Coord[]) {
    const uniquePositions = new Map<number, Set<number>>();
    for (const node of coords) {
      let yCoords = uniquePositions.get(node[0]);
      if (!yCoords) {
        yCoords = new Set();
        uniquePositions.set(node[0], yCoords);
      }
      yCoords.add(node[1]);
    }

    return uniquePositions;
  }

  protected override part1(input: string): string {
    const grid = Grid.fromInput({ input });
    const antennas = this.getAntennas(grid);

    const antinodes = this.getAntinodes(grid, antennas, false);
    const uniquePositions = this.getUniquePositions(antinodes);

    return Array.from(uniquePositions.values())
      .reduce((acc, curr) => acc + curr.size, 0)
      .toString();
  }

  protected override part2(input: string): string {
    const grid = Grid.fromInput({ input });
    const antennas = this.getAntennas(grid);

    const antinodes = this.getAntinodes(grid, antennas, true);
    const uniquePositions = this.getUniquePositions(antinodes);

    return Array.from(uniquePositions.values())
      .reduce((acc, curr) => acc + curr.size, 0)
      .toString();
  }
}
