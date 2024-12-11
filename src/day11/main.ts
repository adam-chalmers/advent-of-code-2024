import { Day } from "../common/day";

export class Day11 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private parseStones(input: string) {
    const stones = input.split(" ").map((x) => Number.parseInt(x));
    const map = new Map<number, number>();
    for (const stone of stones) {
      map.set(stone, (map.get(stone) ?? 0) + 1);
    }
    return map;
  }

  private blinkResult(stone: number) {
    const newStones: number[] = [];
    if (stone === 0) {
      newStones.push(1);
    } else {
      const str = stone.toString();
      if (str.length % 2 === 0) {
        const factor = Math.pow(10, str.length / 2);
        const firstHalf = Math.floor(stone / factor);
        newStones.push(firstHalf);
        newStones.push(stone - firstHalf * factor);
      } else {
        newStones.push(stone * 2024);
      }
    }

    return newStones;
  }

  private blink(stones: Map<number, number>): Map<number, number> {
    const newStones = new Map<number, number>();
    for (const [stone, multiplier] of stones) {
      const result = this.blinkResult(stone);
      for (const stoneNumber of result) {
        newStones.set(stoneNumber, (newStones.get(stoneNumber) ?? 0) + multiplier);
      }
    }

    return newStones;
  }

  protected override part1(input: string): string {
    let stones = this.parseStones(input);

    for (let i = 0; i < 25; i++) {
      stones = this.blink(stones);
    }
    return Array.from(stones.values())
      .reduce((acc, curr) => acc + curr, 0)
      .toString();
  }

  protected override part2(input: string): string {
    let stones = this.parseStones(input);

    for (let i = 0; i < 75; i++) {
      stones = this.blink(stones);
    }
    return Array.from(stones.values())
      .reduce((acc, curr) => acc + curr, 0)
      .toString();
  }
}
