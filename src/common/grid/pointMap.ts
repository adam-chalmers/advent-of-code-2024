import { Point } from "./point";

export class PointMap<T> implements Map<Point, T> {
  private readonly pointMap: Map<string, { point: Point; value: T }>;

  public constructor(pairs?: [Point, T][]) {
    this.pointMap = new Map();
    if (!pairs) return;

    for (const [point, value] of pairs) {
      this.set(point, value);
    }
  }

  public clear(): void {
    this.pointMap.clear();
  }

  public delete(key: Point): boolean {
    return this.pointMap.delete(`${key.x}-${key.y}`);
  }

  public forEach(callbackfn: (value: T, key: Point, map: Map<Point, T>) => void, thisArg?: any): void {
    for (const [key, value] of this.entries()) {
      callbackfn(value, key, this);
    }
  }

  public get(key: Point): T | undefined {
    return this.pointMap.get(`${key.x}-${key.y}`)?.value;
  }

  public has(key: Point): boolean {
    return this.pointMap.has(`${key.x}-${key.y}`);
  }

  public set(key: Point, value: T): this {
    this.pointMap.set(`${key.x}-${key.y}`, { point: key, value });
    return this;
  }

  public get size(): number {
    return this.pointMap.size;
  }

  public entries(): MapIterator<[Point, T]> {
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

        const { point, value } = result.value;
        return { done: false, value: [point, value] };
      },
    };
  }

  public keys(): MapIterator<Point> {
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

        const { point } = result.value;
        return { done: false, value: point };
      },
    };
  }

  public values(): MapIterator<T> {
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

        const { value } = result.value;
        return { done: false, value };
      },
    };
  }

  [Symbol.iterator](): MapIterator<[Point, T]> {
    throw new Error("Method not implemented.");
  }

  [Symbol.toStringTag] = "PointMap";

  public ensure(point: Point, ifNotExists: () => T): T {
    let existing = this.pointMap.get(`${point.x}-${point.y}`);
    if (existing !== undefined) {
      return existing.value;
    }

    existing = { point, value: ifNotExists() };
    this.pointMap.set(`${point.x}-${point.y}`, existing);
    return existing.value;
  }
}
