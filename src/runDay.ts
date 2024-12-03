import fs from "node:fs";
import path from "node:path";
import { getDayNumber } from "./common/utils";
import { Day } from "./common/day";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const parser = yargs(hideBin(process.argv))
  .option("part", {
    alias: "p",
    type: "number",
    description: "The part to run",
    requiresArg: true,
    demandOption: true,
  })
  .option("example", {
    boolean: true,
    default: false,
  });

const getLatestDay = () => {
  const src = __dirname;
  const folders = fs
    .readdirSync(src)
    .filter(
      (x) => x.startsWith("day") && fs.statSync(path.join(src, x)).isDirectory()
    );

  const dayNumber = getDayNumber();
  if (folders.find((x) => x === `day${dayNumber}`)) {
    return {
      filePath: path.join(src, `day${dayNumber}/main.ts`),
      className: `Day${dayNumber}`,
    };
  }

  const latestDay = Math.max(
    ...folders.map((x) => Number.parseInt(x.slice(3)))
  );
  return {
    filePath: path.join(src, `day${latestDay}/main.ts`),
    className: `Day{latestDay}`,
  };
};

const main = async () => {
  const { example, part } = await parser.parse();
  if (part !== 1 && part !== 2) {
    console.error(`Invalid part entered: ${part}`);
    process.exitCode = 1;
    return;
  }

  const { filePath, className } = getLatestDay();
  const imported = await import(filePath);
  const DayClass = imported[className] as new () => Day;

  new DayClass().run({ example, part });
};

main();
