import { Day } from "../common/day";

export class Day3 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private getMultiples = (input: string) => {
    const results = input.matchAll(/mul\(([0-9]{1,3}),([0-9]{1,3})\)/g);
    const allValues: { value: number; index: number }[] = [];
    for (const result of results) {
      allValues.push({
        value: Number.parseInt(result[1]) * Number.parseInt(result[2]),
        index: result.index,
      });
    }

    return allValues;
  };

  protected override part1(input: string): string {
    return this.getMultiples(input)
      .reduce((acc, curr) => acc + curr.value, 0)
      .toString();
  }

  protected override part2(input: string): string {
    const matches = input.matchAll(/do(?:n't)?\(\)?/g);
    const commands: { enabled: boolean; index: number }[] = [];
    for (const match of matches) {
      commands.push({ enabled: match[0] === "do()", index: match.index });
    }

    const multiples = this.getMultiples(input);
    let sum = 0;
    let j = multiples.length - 1;
    for (let i = commands.length - 1; i >= -1; i--) {
      while (j >= 0 && (i === -1 || multiples[j].index > commands[i].index)) {
        if (i === -1 || commands[i].enabled) {
          sum += multiples[j].value;
        }
        j--;
      }
    }

    return sum.toString();
  }
}
