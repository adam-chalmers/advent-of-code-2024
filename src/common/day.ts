import path from "node:path";
import fs from "node:fs";
import { hrtime } from "node:process";

export abstract class Day {
  protected abstract getDir(): string;

  protected readInput(example: boolean) {
    const dir = this.getDir();
    const inputPath = path.join(dir, example ? "example.txt" : "input.txt");
    if (!fs.existsSync(inputPath)) {
      throw new Error(`File does not exist. Expected path: ${inputPath}`);
    }

    return fs.readFileSync(inputPath, "utf-8");
  }

  protected abstract part1(input: string): string;

  protected abstract part2(input: string): string;

  public run({ example, part }: { example?: boolean; part: 1 | 2 }): void {
    const input = this.readInput(example ?? false);

    const start = hrtime.bigint();
    let result: string;
    switch (part) {
      case 1:
        result = this.part1(input);
        break;
      case 2:
        result = this.part2(input);
        break;
      default:
        throw new Error(`Invalid part entered: ${part}`);
    }

    console.log(result);
    console.log(`Ran in ${Number(hrtime.bigint() - start) / 1_000_000}ms`);
  }
}
