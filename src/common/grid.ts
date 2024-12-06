export type Coord = [x: number, y: number];

export interface GridArgs<T = string> {
  grid: T[][];
  printEntry?: (x: T) => string;
}

export interface MappedGridArgs<T> extends GridArgs<T> {
  parse: (x: string) => T;
}

const DEFAULT_PRINT_ENTRY = (x: unknown): string =>
  x == null ? "" : x.toString();

export class Grid<T = string> {
  private readonly original: readonly (readonly T[])[];
  private readonly printEntry: (x: T) => string;
  private grid: T[][];

  public readonly width: number;
  public readonly height: number;

  public constructor(args: GridArgs<T>) {
    const { grid, printEntry } = args;
    this.original = grid.map((x) => [...x]);
    this.printEntry = printEntry ?? DEFAULT_PRINT_ENTRY;
    this.grid = grid;

    this.height = grid.length;
    this.width = grid[0].length;
  }

  public static fromInput(args: {
    input: string;
    printEntry?: (x: string) => string;
  }) {
    const { input, printEntry } = args;
    return new Grid({
      grid: input
        .split("\n")
        .map((x) => x.split(""))
        .reverse(),
      printEntry,
    });
  }

  public static fromInputMapped<T>(args: {
    input: string;
    parse: (x: string) => T;
    printEntry?: GridArgs<T>["printEntry"];
  }): Grid<T> {
    const { input, parse, printEntry } = args;
    return new Grid<T>({
      grid: input
        .split("\n")
        .map((x) => x.split("").map((y) => parse(y)))
        .reverse(),
      printEntry,
    });
  }

  public getRow(y: number) {
    return this.grid[y];
  }

  public getColumn(x: number) {
    return this.grid.map((row) => row[x]);
  }

  public get(coord: Coord): T;
  public get(x: number, y: number): T;
  public get(x: number | Coord, y?: number): T {
    if (y !== undefined) {
      return this.grid[y][x as number];
    }
    return this.grid[(x as Coord)[1]][(x as Coord)[0]];
  }

  public tryGet(coord: Coord): T | undefined;
  public tryGet(x: number, y: number): T | undefined;
  public tryGet(x: number | Coord, y?: number): T | undefined {
    if (y !== undefined) {
      return this.grid[y]?.[x as number];
    }
    return this.grid[(x as Coord)[1]]?.[(x as Coord)[0]];
  }

  public set(coord: Coord, value: T): void;
  public set(x: number, y: number, value: T): void;
  public set(x: number | Coord, y: number | T, value?: T) {
    if (typeof x === "number") {
      this.grid[y as number][x] = value as T;
      return;
    }

    this.grid[(x as Coord)[1]][(x as Coord)[0]] = y as T;
    return this;
  }

  public reset() {
    this.grid = this.original.map((x) => [...x]);
    return this;
  }
}
