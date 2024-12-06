import { Day } from "../common/day";

export class Day5 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private getRules(pages: string) {
    const rules = new Map<string, string[]>();
    for (const line of pages.split("\n")) {
      const [a, b] = line.split("|");
      let arr = rules.get(a);
      if (!arr) {
        arr = [];
        rules.set(a, arr);
      }
      arr.push(b);
    }

    return rules;
  }

  private sortUpdates(updates: string, rules: Map<string, string[]>) {
    const correct: string[][] = [];
    const incorrect: string[][] = [];
    for (const line of updates.split("\n")) {
      const pages = line.split(",");
      let isCorrect = true;
      for (let i = 0; i < pages.length; i++) {
        const before = rules.get(pages[i]);
        if (!before) continue;

        if (pages.slice(0, i).some((x) => before.includes(x))) {
          isCorrect = false;
          continue;
        }
      }

      if (isCorrect) {
        correct.push(pages);
      } else {
        incorrect.push(pages);
      }
    }

    return { correct, incorrect };
  }

  protected override part1(input: string): string {
    const [pages, updates] = input.split("\n\n");
    const rules = this.getRules(pages);
    const { correct } = this.sortUpdates(updates, rules);

    return correct
      .reduce((acc, curr) => {
        return acc + Number.parseInt(curr[(curr.length - 1) / 2]);
      }, 0)
      .toString();
  }

  protected override part2(input: string): string {
    const [pages, updates] = input.split("\n\n");
    const rules = this.getRules(pages);
    const { incorrect } = this.sortUpdates(updates, rules);
    const corrected: string[][] = [];
    for (let update of incorrect) {
      for (let i = 0; i < update.length; i++) {
        const before = rules.get(update[i]);
        if (!before) continue;

        if (update.slice(0, i).some((x) => before.includes(x))) {
          update = update
            .slice(0, i - 1)
            .concat([update[i], update[i - 1]])
            .concat(update.slice(i + 1));
          i -= 2;
        }
      }

      corrected.push(update);
    }

    return corrected
      .reduce((acc, curr) => {
        return acc + Number.parseInt(curr[(curr.length - 1) / 2]);
      }, 0)
      .toString();
  }
}
