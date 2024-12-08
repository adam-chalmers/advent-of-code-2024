export class Point {
  public constructor(public readonly x: number, public readonly y: number) {}

  public static fromTuple(tuple: [x: number, y: number]) {
    return new Point(tuple[0], tuple[1]);
  }

  public equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }
}
