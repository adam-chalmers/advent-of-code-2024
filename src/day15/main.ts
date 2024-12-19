import { Day } from "../common/day";
import { Grid } from "../common/grid/grid";
import { Point } from "../common/grid/point";

export class Day15 extends Day {
  protected getDir(): string {
    return __dirname;
  }

  private getRobotPos(grid: Grid) {
    for (const { point, value } of grid) {
      if (value === "@") {
        return point;
      }
    }

    throw new Error("Could not find robot in grid");
  }

  private getHorizontalBoxes(grid: Grid, robotPos: Point, forwards: (point: Point) => Point) {
    let currentPoint = forwards(robotPos);
    let currentValue = grid.get(currentPoint);
    const boxPoints: { point: Point; value: string }[] = [];
    while (currentValue === "[" || currentValue === "]" || currentValue === "O") {
      boxPoints.unshift({ point: currentPoint, value: currentValue });
      currentPoint = forwards(currentPoint);
      currentValue = grid.get(currentPoint);
    }
    return currentValue === "." ? boxPoints : null;
  }

  private getVerticalBoxes(
    grid: Grid,
    robotPos: Point,
    forwards: (point: Point) => Point,
    boxPoints: { point: Point; value: string }[] = []
  ) {
    let currentPoint = forwards(robotPos);
    let currentValue = grid.get(currentPoint);
    if (currentValue === "[" || currentValue === "]" || currentValue === "O") {
      boxPoints.unshift({ point: currentPoint, value: currentValue });
      if (currentValue === "[") {
        boxPoints.unshift({ point: currentPoint.right(), value: "]" });
        const a = this.getVerticalBoxes(grid, currentPoint, forwards, boxPoints);
        if (!a) return null;
        const b = this.getVerticalBoxes(grid, currentPoint.right(), forwards, boxPoints);
        if (!b) return null;
      } else if (currentValue === "]") {
        boxPoints.unshift({ point: currentPoint.left(), value: "[" });
        const a = this.getVerticalBoxes(grid, currentPoint, forwards, boxPoints);
        if (!a) return null;
        const b = this.getVerticalBoxes(grid, currentPoint.left(), forwards, boxPoints);
        if (!b) return null;
      } else {
        const a = this.getVerticalBoxes(grid, currentPoint, forwards, boxPoints);
        if (!a) return null;
      }

      return boxPoints;
    }

    return currentValue === "." ? boxPoints : null;
  }

  private followInstructions(grid: Grid, instructions: string) {
    let robotPos = this.getRobotPos(grid);

    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      let forwards: (point: Point) => Point;
      let backwards: (point: Point) => Point;
      let getBoxes: (startingPoint: Point) => { point: Point; value: string }[] | null;
      switch (instruction) {
        case "v":
          forwards = (point) => point.down();
          backwards = (point) => point.up();
          getBoxes = () => {
            const boxPoints = this.getVerticalBoxes(grid, robotPos, forwards);
            if (!boxPoints) {
              return null;
            }

            return boxPoints.sort((a, b) => a.point.y - b.point.y);
          };
          break;
        case "^":
          forwards = (point) => point.up();
          backwards = (point) => point.down();
          getBoxes = () => {
            const boxPoints = this.getVerticalBoxes(grid, robotPos, forwards);
            if (!boxPoints) {
              return null;
            }

            return boxPoints.sort((a, b) => b.point.y - a.point.y);
          };
          break;
        case "<":
          forwards = (point) => point.left();
          backwards = (point) => point.right();
          getBoxes = () => this.getHorizontalBoxes(grid, robotPos, forwards);
          break;
        case ">":
          forwards = (point) => point.right();
          backwards = (point) => point.left();
          getBoxes = () => this.getHorizontalBoxes(grid, robotPos, forwards);
          break;
        default:
          throw new Error(`Invalid instruction: '${instruction}'`);
      }

      const boxes = getBoxes(robotPos);
      if (!boxes) {
        continue;
      }

      for (const { point, value } of boxes) {
        grid.set(forwards(point), value);
        grid.set(point, ".");
      }
      grid.set(forwards(robotPos), "@");
      grid.set(robotPos, ".");
      robotPos = forwards(robotPos);
    }
  }

  protected override part1(input: string): string {
    const [diagram, rawInstructions] = input.split("\n\n");
    const instructions = rawInstructions.split("\n").join("");
    const grid = Grid.fromInput({ input: diagram });

    this.followInstructions(grid, instructions);

    let sum = 0;
    for (const { point, value } of grid) {
      if (value !== "O" && value !== "[") continue;

      sum += (grid.height - 1 - point.y) * 100 + point.x;
    }
    return sum.toString();
  }

  protected override part2(input: string): string {
    const [diagram, rawInstructions] = input.split("\n\n");
    const instructions = rawInstructions.split("\n").join("");

    let newString = "";
    for (const char of diagram) {
      switch (char) {
        case ".":
          newString += "..";
          break;
        case "@":
          newString += "@.";
          break;
        case "#":
          newString += "##";
          break;
        case "O":
          newString += "[]";
          break;
        case "\n":
          newString += "\n";
          break;
        default:
          throw new Error(`Unrecognised character in diagram: '${char}'`);
      }
    }
    const grid = Grid.fromInput({ input: newString });

    this.followInstructions(grid, instructions);
    grid.print();

    let sum = 0;
    for (const { point, value } of grid) {
      if (value !== "O" && value !== "[") continue;

      sum += (grid.height - 1 - point.y) * 100 + point.x;
    }
    return sum.toString();
  }
}
