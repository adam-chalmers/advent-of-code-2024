import { Day } from "../common/day";

export class Day7 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private concat(a: number, b: number): number {
    return Number.parseInt(a.toString() + b.toString());
  }

  private testCombinations(target: number, val: number, remaining: number[], concat: boolean): boolean {
    if (remaining.length === 1) {
      if (val + remaining[0] === target || val * remaining[0] === target || (concat && this.concat(val, remaining[0]) === target)) {
        return true;
      }

      return false;
    }

    if (this.testCombinations(target, val + remaining[0], remaining.slice(1), concat)) {
      return true;
    }
    if (this.testCombinations(target, val * remaining[0], remaining.slice(1), concat)) {
      return true;
    }
    if (concat && this.testCombinations(target, this.concat(val, remaining[0]), remaining.slice(1), concat)) {
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
      if (this.testCombinations(target, numbers[0], numbers.slice(1), false)) {
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
      if (this.testCombinations(target, numbers[0], numbers.slice(1), false)) {
        sum += target;
      } else if (this.testCombinations(target, numbers[0], numbers.slice(1), true)) {
        sum += target;
      }
    }

    return sum.toString();
  }
}
