import { Day } from "../common/day";
import { Point } from "../common/grid/point";

interface Machine {
  a: Point;
  b: Point;
  prize: Point;
}

export class Day13 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  /**
   * Cache for calculated factors of numbers.
   */
  private readonly factors = new Map<number, Map<number, number>>();

  /**
   * Parse the input string into a list of machines.
   */
  private parseMachines(input: string) {
    const machineInputs = input.split("\n\n");

    const machines: Machine[] = [];
    for (const machineInput of machineInputs) {
      const lines = machineInput.split("\n");
      const a = Point.fromTuple(
        lines[0]
          .slice(10)
          .split(", ")
          .map((x) => Number.parseInt(x.slice(1))) as [number, number]
      );
      const b = Point.fromTuple(
        lines[1]
          .slice(10)
          .split(", ")
          .map((x) => Number.parseInt(x.slice(1))) as [number, number]
      );
      const prize = Point.fromTuple(
        lines[2]
          .slice(7)
          .split(", ")
          .map((x) => Number.parseInt(x.slice(2))) as [number, number]
      );
      machines.push({ a, b, prize });
    }

    return machines;
  }

  /**
   * Find the prime factors of a number.
   * @returns A map where the keys are prime factors, and the values are the number of times that factor divides the input number.
   */
  private getFactors(x: number) {
    const factors = new Map<number, number>();
    for (let i = 2; i <= x; i++) {
      while (true) {
        const newX = x / i;
        if (Number.isInteger(newX)) {
          factors.set(i, (factors.get(i) ?? 0) + 1);
          x = newX;
        } else {
          break;
        }
      }
    }

    return factors;
  }

  /**
   * Find the least common multiple between two numbers.
   */
  private lcm(a: number, b: number) {
    let aFactors = this.factors.get(a);
    let bFactors = this.factors.get(b);

    if (!aFactors) {
      aFactors = this.getFactors(a);
      this.factors.set(a, aFactors);
    }
    if (!bFactors) {
      bFactors = this.getFactors(b);
      this.factors.set(b, bFactors);
    }

    let lcm = 1;
    for (let factor of new Set([...aFactors.keys(), ...bFactors.keys()])) {
      lcm *= factor ** Math.max(aFactors.get(factor) ?? 0, bFactors.get(factor) ?? 0);
    }
    return lcm;
  }

  /**
   * Get the number of a presses and b presses needed to reach the prize for a given machine,
   * such that the number of b presses is maximised and the number of a presses is minimised.
   * @param machine The machine to calculate button presses for.
   * @param offset An optional offset that will be added to the machine's prize's x and y coordinates.
   * @returns The number of a and b presses needed to reach the prize, otherwise null if the prize cannot be reached.
   */
  private getButtonPresses(machine: Machine, offset: number = 0) {
    // If both x or both y coords are even but the prize x or prize y is odd, then it's impossible to hit
    if (machine.a.x % 2 === 0 && machine.b.x % 2 === 0 && machine.prize.x % 2 === 1) {
      return null;
    }
    if (machine.a.y % 2 === 0 && machine.b.y % 2 === 0 && machine.prize.y % 2 === 1) {
      return null;
    }

    machine.prize = new Point(machine.prize.x + offset, machine.prize.y + offset);

    // Find the max number of b presses that get us equal to or as close to but under the prize x coord
    let bPresses = Math.floor(machine.prize.x / machine.b.x);
    let aPresses = 0;

    // Current x coord
    let x = bPresses * machine.b.x;

    // Keep track of already visited x coords so we can exit if we end up in a loop (eg. a has x+45 and b has x+30)
    const xVisited = new Set([x]);
    // Find the minimum number of b presses to subtract and a presses to add that get us to the prize x coord exactly
    while (bPresses > 0 && x !== machine.prize.x) {
      if (x > machine.prize.x) {
        x -= machine.b.x;
        bPresses--;
      } else {
        x += machine.a.x;
        aPresses++;
      }
      if (xVisited.has(x)) {
        break;
      }

      xVisited.add(x);
    }

    // If we exit the loop without being exactly at the prize x coord then it's impossible to hit
    if (x !== machine.prize.x) {
      return null;
    }

    // If we're somehow at the prize y coord too then return early, we're done
    let y = aPresses * machine.a.y + bPresses * machine.b.y;
    if (y === machine.prize.y) {
      return { aPresses, bPresses };
    }

    // Find the lowest common multiple of both x changes.
    // Using this, we can find the number of a presses to add and b presses to subtract
    // that bring us back to the same x coord while changing the y coord.
    const lcm = this.lcm(machine.a.x, machine.b.x);
    const aPerLoop = lcm / machine.a.x;
    const bPerLoop = lcm / machine.b.x;

    // If the y coord increases when performing a loop and the y coord is already above the prize's y coord
    // or the y coord decreases when performing a loop and the y coord is already below the prize's y coord
    // then it's impossible to hit and we can exit early
    const yLoopDelta = aPerLoop * machine.a.y - bPerLoop * machine.b.y;
    if ((yLoopDelta <= 0 && y < machine.prize.y) || (yLoopDelta >= y && y > machine.prize.y)) {
      return null;
    }

    // If there isn't a clean integer number of loops required then it's impossible to hit and we can exit early
    const loopsRequired = Math.abs((y - machine.prize.y) / yLoopDelta);
    if (!Number.isInteger(loopsRequired)) {
      return null;
    }

    // Add number of tokens required to the sum
    aPresses += loopsRequired * aPerLoop;
    bPresses -= loopsRequired * bPerLoop;

    return { aPresses, bPresses };
  }

  protected override part1(input: string): string {
    const machines = this.parseMachines(input);

    let sum = 0;
    for (const machine of machines) {
      const result = this.getButtonPresses(machine);
      if (!result) continue;
      sum += result.aPresses * 3 + result.bPresses;
    }

    return sum.toString();
  }

  protected override part2(input: string): string {
    const machines = this.parseMachines(input);

    let sum = 0;
    for (const machine of machines) {
      const result = this.getButtonPresses(machine, 10000000000000);
      if (!result) continue;
      sum += result.aPresses * 3 + result.bPresses;
    }

    return sum.toString();
  }
}
