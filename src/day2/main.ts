import { Day } from "../common/day";

export class Day2 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private parseInput(input: string) {
    const lines = input.split("\n");
    const reports = lines.map((x) =>
      x.split(" ").map((y) => Number.parseInt(y))
    );
    return reports;
  }

  private reportIsSafe(report: number[], tolerant = false) {
    const copy = [...report];

    let increasing: boolean;
    let increasingSteps = 0;
    let decreasingSteps = 0;
    for (let i = 1; i < copy.length; i++) {
      if (copy[i] > copy[i - 1]) {
        increasingSteps++;
      } else if (copy[i] !== copy[i - 1]) {
        decreasingSteps++;
      }
    }
    if (increasingSteps > 1 && decreasingSteps > 1) return false;
    increasing = increasingSteps > 1;

    let getDiff: (a: number, b: number) => number;
    if (increasing) {
      getDiff = (a, b) => b - a;
    } else {
      getDiff = (a, b) => a - b;
    }

    let i = 1;
    while (i < copy.length) {
      const diff = getDiff(copy[i - 1], copy[i]);
      if (diff < 1 || diff > 3) {
        if (!tolerant) {
          return false;
        }

        if (i === copy.length - 1) {
          return true;
        }

        tolerant = false;
        const nextDiff = getDiff(copy[i - 1], copy[i + 1]);
        if (nextDiff < 1 || nextDiff > 3) {
          copy.splice(i - 1, 1);
          i--;
        } else {
          copy.splice(i, 1);
        }
        continue;
      }
      i++;
    }

    return true;
  }

  protected override part1(input: string): string {
    const parsed = this.parseInput(input);
    const numSafe = parsed.filter((x) => this.reportIsSafe(x)).length;
    return numSafe.toString();
  }

  protected override part2(input: string): string {
    const parsed = this.parseInput(input);
    const numSafe = parsed.filter((x, i) => {
      const isSafe = this.reportIsSafe(x, true);
      return isSafe;
    }).length;
    return numSafe.toString();
  }
}
