import { Day } from "../common/day";

export class Day7 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private addMultiply(
    target: number,
    val: number,
    remaining: number[]
  ): boolean {
    if (remaining.length === 1) {
      if (val + remaining[0] === target || val * remaining[0] === target) {
        return true;
      }

      return false;
    }

    if (this.addMultiply(target, val + remaining[0], remaining.slice(1))) {
      return true;
    }
    if (this.addMultiply(target, val * remaining[0], remaining.slice(1))) {
      return true;
    }

    return false;
  }

  private concat(a: number, b: number): number {
    return Number.parseInt(a.toString() + b.toString());
  }

  private addMultiplyConcat(target: number, val: number, remaining: number[]) {
    if (remaining.length === 1) {
      if (
        val + remaining[0] === target ||
        val * remaining[0] === target ||
        this.concat(val, remaining[0]) === target
      ) {
        return true;
      }

      return false;
    }

    if (
      this.addMultiplyConcat(target, val + remaining[0], remaining.slice(1))
    ) {
      return true;
    }
    if (
      this.addMultiplyConcat(target, val * remaining[0], remaining.slice(1))
    ) {
      return true;
    }
    if (
      this.addMultiplyConcat(
        target,
        this.concat(val, remaining[0]),
        remaining.slice(1)
      )
    ) {
      return true;
    }

    return false;
  }

  protected override part1(input: string): string {
    const lines = input.split("\n");
    let sum = 0;
    for (const line of lines) {
      const [targetStr, components] = line.split(": ");
      const target = Number.parseInt(targetStr);
      const numbers = components.split(" ").map((x) => Number.parseInt(x));
      if (this.addMultiply(target, numbers[0], numbers.slice(1))) {
        sum += target;
      }
    }

    return sum.toString();
  }

  protected override part2(input: string): string {
    const lines = input.split("\n");
    let sum = 0;
    for (const line of lines) {
      const [targetStr, components] = line.split(": ");
      const target = Number.parseInt(targetStr);
      const numbers = components.split(" ").map((x) => Number.parseInt(x));
      if (this.addMultiply(target, numbers[0], numbers.slice(1))) {
        sum += target;
      } else if (this.addMultiplyConcat(target, numbers[0], numbers.slice(1))) {
        sum += target;
      }
    }

    return sum.toString();
  }
}
