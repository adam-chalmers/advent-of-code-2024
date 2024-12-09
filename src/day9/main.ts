import { Day } from "../common/day";

export class Day9 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  protected override part1(input: string): string {
    const numbers = input.split("").map((x) => Number.parseInt(x));
    numbers.push(0);
    const arr: string[] = [];
    let id = 0;
    let totalBlocks = 0;
    for (let i = 0; i <= numbers.length - 1; i += 2) {
      for (let j = 0; j < numbers[i]; j++) {
        arr.push(id.toString());
        totalBlocks++;
      }
      for (let j = 0; j < numbers[i + 1]; j++) {
        arr.push(".");
      }
      id++;
    }

    let j = arr.length - 1;
    for (let i = 0; i < totalBlocks; i++) {
      while (arr[j] === "." && j > 0) {
        j--;
      }
      if (j <= i) break;
      if (arr[i] !== ".") continue;
      arr[i] = arr[j];
      arr[j] = ".";
      j--;
    }

    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === ".") break;
      sum += i * Number.parseInt(arr[i]);
    }
    return sum.toString();
  }

  protected override part2(input: string): string {
    const numbers = input.split("").map((x) => Number.parseInt(x));
    numbers.push(0);

    const blocks: { id: number; location: number; size: number }[] = [];
    const gaps: { location: number; size: number }[] = [];
    let pointer = 0;
    for (let i = 0; i < numbers.length - 1; i += 2) {
      if (numbers[i] !== 0) {
        blocks.push({ id: i / 2, location: pointer, size: numbers[i] });
        pointer += numbers[i];
      }
      if (numbers[i + 1] !== 0) {
        gaps.push({ location: pointer, size: numbers[i + 1] });
        pointer += numbers[i + 1];
      }
    }

    for (let i = blocks.length - 1; i >= 0; i--) {
      if (blocks[i].location < gaps[0].location) break;

      const block = blocks[i];
      for (let j = 0; j < gaps.length; j++) {
        const gap = gaps[j];
        if (gap.location > block.location) break;
        if (gap.size < block.size) continue;

        block.location = gap.location;
        gap.size -= block.size;
        if (gap.size === 0) {
          gaps.splice(j, 1);
        } else {
          gap.location += block.size;
        }
        break;
      }
    }

    let sum = 0;
    for (const block of blocks) {
      sum += block.id * ((block.size + 1) * (block.size / 2) + block.size * (block.location - 1));
    }

    return sum.toString();
  }
}
