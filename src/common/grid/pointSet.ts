import { Point } from "./point";

export class PointSet implements Set<Point> {
  private readonly pointMap: Map<number, Set<number>>;

  public constructor(points?: Point[]) {
    this.pointMap = new Map();
    this._size = 0;
    if (!points) return;

    for (const point of points) {
      this.add(point);
    }
  }

  public add(value: Point): this {
    let ySet = this.pointMap.get(value.x);
    if (!ySet) {
      ySet = new Set();
      this.pointMap.set(value.x, ySet);
    }
    if (!ySet.has(value.y)) {
      this._size++;
    }
    ySet.add(value.y);

    return this;
  }

  public clear(): void {
    this.pointMap.clear();
    this._size = 0;
  }

  public delete(value: Point): boolean {
    const ySet = this.pointMap.get(value.x);
    if (!ySet) return false;

    const wasDeleted = ySet.delete(value.y);
    if (wasDeleted) {
      this._size--;
    }
    return wasDeleted;
  }

  public forEach(callbackfn: (value: Point, value2: Point, set: Set<Point>) => void, thisArg?: any): void {
    throw new Error("Method not implemented.");
  }

  public has(value: Point): boolean {
    return this.pointMap.get(value.y)?.has(value.x) ?? false;
  }

  private _size: number = 0;
  public get size(): number {
    return this._size;
  }

  public entries(): SetIterator<[Point, Point]> {
    throw new Error("Method not implemented.");
  }

  public keys(): SetIterator<Point> {
    throw new Error("Method not implemented.");
  }

  public values(): SetIterator<Point> {
    throw new Error("Method not implemented.");
  }

  public [Symbol.iterator](): SetIterator<Point> {
    throw new Error("Method not implemented.");
  }

  public [Symbol.toStringTag] = "PoitnSet";
}
