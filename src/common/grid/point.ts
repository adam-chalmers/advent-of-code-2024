export class Point {
  public constructor(public readonly x: number, public readonly y: number) {}

  public static fromTuple(tuple: [x: number, y: number]) {
    return new Point(tuple[0], tuple[1]);
  }

  public equals(point: Point): boolean {
    return this.x === point.x && this.y === point.y;
  }

  public left(): Point {
    return new Point(this.x - 1, this.y);
  }

  public right(): Point {
    return new Point(this.x + 1, this.y);
  }

  public up(): Point {
    return new Point(this.x, this.y + 1);
  }

  public down(): Point {
    return new Point(this.x, this.y - 1);
  }
}
