import { Point } from "./point";

export class PointSet implements Set<Point> {
  private readonly pointMap: Map<string, Point>;

  public constructor(points?: Point[]) {
    this.pointMap = new Map();
    if (!points) return;

    for (const point of points) {
      this.add(point);
    }
  }

  public add(value: Point): this {
    this.pointMap.set(`${value.x}-${value.y}`, value);
    return this;
  }

  public clear(): void {
    this.pointMap.clear();
  }

  public delete(value: Point): boolean {
    return this.pointMap.delete(`${value.x}-${value.y}`);
  }

  public forEach(callbackfn: (value: Point, value2: Point, set: Set<Point>) => void, thisArg?: any): void {
    for (const [key, value] of this.entries()) {
      callbackfn(value, key, this);
    }
  }

  public has(value: Point): boolean {
    return this.pointMap.has(`${value.x}-${value.y}`);
  }

  public get size(): number {
    return this.pointMap.size;
  }

  public entries(): SetIterator<[Point, Point]> {
    const iter = this.pointMap.values();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        const result = iter.next();
        if (result.done) {
          return { done: true, value: undefined };
        }

        return { done: false, value: [result.value, result.value] };
      },
    };
  }

  private getIterator(): SetIterator<Point> {
    const iter = this.pointMap.values();
    return {
      [Symbol.iterator]() {
        return this;
      },
      next: () => {
        const result = iter.next();
        if (result.done) {
          return { done: true, value: undefined };
        }

        return { done: false, value: result.value };
      },
    };
  }

  public keys(): SetIterator<Point> {
    return this.getIterator();
  }

  public values(): SetIterator<Point> {
    return this.getIterator();
  }

  public [Symbol.iterator](): SetIterator<Point> {
    return this.getIterator();
  }

  public [Symbol.toStringTag] = "PointSet";
}
