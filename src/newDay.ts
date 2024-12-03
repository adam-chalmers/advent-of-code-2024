import fs from "node:fs";
import path from "node:path";
import { getDayNumber } from "./common/utils";

const template = (day: number) => `import { Day } from "../common/day";

export class Day${day} extends Day {
  protected getDir(): string {
    return __dirname;
  }

  protected override part1(input: string): string {
    return "Not implemented";
  }

  protected override part2(input: string): string {
    return "Not implemented";
  }
}
`;

const getToken = (projectDir: string) => {
  return fs.readFileSync(path.join(projectDir, ".token"), "utf-8");
};

const getInput = async (token: string, day: number) => {
  const result = await fetch(`https://adventofcode.com/2024/day/${day}/input`, {
    headers: {
      cookie: `session=${token};`,
    },
  });
  const text = await result.text();
  return text.trimEnd();
};

const main = async () => {
  const src = __dirname;
  const folders = fs
    .readdirSync(src)
    .filter(
      (x) => x.startsWith("day") && fs.statSync(path.join(src, x)).isDirectory()
    );

  const root = path.join(src, "..");
  const token = getToken(root);

  const currentDay = getDayNumber();
  console.log(`Checking up to day ${currentDay}`);
  for (let i = 1; i <= currentDay; i++) {
    const dir = `day${i}`;
    if (folders.find((x) => x === dir)) {
      console.log(`Found folder for day ${i} - skipping`);
      continue;
    }

    const newDir = path.join(src, dir);
    fs.mkdirSync(newDir);

    const mainPath = path.join(newDir, "main.ts");
    fs.writeFileSync(mainPath, template(i));
    console.log(`Created file for day ${i} at ${mainPath}`);

    console.log(`Retrieving input for day ${i}...`);
    const input = await getInput(token, i);
    fs.writeFileSync(path.join(newDir, "input.txt"), input);
    fs.writeFileSync(path.join(newDir, "example.txt"), "");
  }
};

main();
