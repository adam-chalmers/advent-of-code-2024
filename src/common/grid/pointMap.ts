import { Point } from "./point";

export class PointMap<T> implements Map<Point, T> {
  private readonly pointMap: Map<number, Map<number, T>>;

  public constructor(pairs?: [Point, T][]) {
    this.pointMap = new Map();
    this._size = 0;
    if (!pairs) return;

    for (const [point, value] of pairs) {
      this.set(point, value);
    }
  }

  public clear(): void {
    this.pointMap.clear();
  }

  public delete(key: Point): boolean {
    const yMap = this.pointMap.get(key.x);
    if (!yMap) return false;

    const wasDeleted = yMap.delete(key.y);
    if (wasDeleted) {
      this._size--;
    }
    return wasDeleted;
  }

  public forEach(callbackfn: (value: T, key: Point, map: Map<Point, T>) => void, thisArg?: any): void {
    throw new Error("Method not implemented.");
  }

  public get(key: Point): T | undefined {
    return this.pointMap.get(key.x)?.get(key.y);
  }

  public has(key: Point): boolean {
    return this.pointMap.get(key.x)?.has(key.y) ?? false;
  }

  public set(key: Point, value: T): this {
    let yMap = this.pointMap.get(key.x);
    if (!yMap) {
      yMap = new Map();
      this.pointMap.set(key.x, yMap);
    }

    if (!yMap.has(key.x)) {
      this._size++;
    }
    yMap.set(key.y, value);
    return this;
  }

  private _size: number;
  public get size(): number {
    return this._size;
  }

  entries(): MapIterator<[Point, T]> {
    throw new Error("Method not implemented.");
  }

  keys(): MapIterator<Point> {
    throw new Error("Method not implemented.");
  }

  values(): MapIterator<T> {
    throw new Error("Method not implemented.");
  }

  [Symbol.iterator](): MapIterator<[Point, T]> {
    throw new Error("Method not implemented.");
  }

  [Symbol.toStringTag] = "PointMap";
}
