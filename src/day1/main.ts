import { Day } from "../common/day";

export class Day1 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private getLists(input: string) {
    const lines = input.split("\n");
    const firstList: number[] = [];
    const secondList: number[] = [];

    for (const line of lines) {
      const [a, b] = line.split("   ");
      firstList.push(Number.parseInt(a));
      secondList.push(Number.parseInt(b));
    }

    return { firstList, secondList };
  }

  protected override part1(input: string): string {
    const { firstList, secondList } = this.getLists(input);

    firstList.sort((a, b) => a - b);
    secondList.sort((a, b) => a - b);

    let totalDistance = 0;
    for (let i = 0; i < firstList.length; i++) {
      totalDistance += Math.abs(firstList[i] - secondList[i]);
    }

    return totalDistance.toString();
  }

  protected override part2(input: string): string {
    const { firstList, secondList } = this.getLists(input);
    const firstCounts = new Map<number, number>();
    const secondCounts = new Map<number, number>();

    for (const entry of firstList) {
      firstCounts.set(entry, (firstCounts.get(entry) ?? 0) + 1);
    }
    for (const entry of secondList) {
      secondCounts.set(entry, (secondCounts.get(entry) ?? 0) + 1);
    }

    let similarityScore = 0;
    for (const [firstNum, firstCount] of firstCounts) {
      const secondCount = secondCounts.get(firstNum) ?? 0;
      similarityScore += firstNum * firstCount * secondCount;
    }

    return similarityScore.toString();
  }
}
