import fs from "node:fs";
import path from "node:path";
import { getDayNumber } from "./common/utils";
import { Day } from "./common/day";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { exec } from "node:child_process";

const parser = yargs(hideBin(process.argv))
  .option("part", {
    alias: "p",
    type: "number",
    description: "The part to run",
    requiresArg: true,
    demandOption: true,
  })
  .option("day", {
    alias: "d",
    type: "number",
    description: "The day to run. If omitted, defaults to latest day",
    requiresArg: false,
    demandOption: false,
  })
  .option("example", {
    boolean: true,
    default: false,
  })
  .option("debug", {
    boolean: true,
    default: false,
  });

const getDay = (day?: number) => {
  const src = __dirname;
  const folders = fs.readdirSync(src).filter((x) => x.startsWith("day") && fs.statSync(path.join(src, x)).isDirectory());

  const dayNumber = day ?? getDayNumber();
  if (folders.find((x) => x === `day${dayNumber}`)) {
    return {
      filePath: path.join(src, `day${dayNumber}/main.ts`),
      className: `Day${dayNumber}`,
    };
  }

  const latestDay = Math.max(...folders.map((x) => Number.parseInt(x.slice(3))));
  return {
    filePath: path.join(src, `day${latestDay}/main.ts`),
    className: `Day{latestDay}`,
  };
};

const runDirectly = async (args: { part: number; example: boolean; filePath: string; className: string }) => {
  const { part, example, filePath, className } = args;
  if (part !== 1 && part !== 2) {
    console.error(`Invalid part entered: ${part}`);
    process.exitCode = 1;
    return;
  }

  const imported = await import(filePath);
  const DayClass = imported[className] as new () => Day;

  new DayClass().run({ example, part });
};

const runWithDebug = (args: { day?: number; part: number; example: boolean }) => {
  const { day, part, example } = args;
  let command = `node --inspect -r @swc-node/register ./src/runDay.ts -p ${part}`;
  if (day) {
    command += ` -d ${day}`;
  }
  if (example) {
    command += " --example";
  }
  try {
    exec(command, (err, stdout, stderr) => {
      if (err) console.error(err);
      if (stderr) console.error(stderr);
      if (stdout) console.log(stdout);
    });
  } catch (err) {
    console.error(err);
  }
};

const main = async () => {
  const { day, part, example, debug } = await parser.parse();
  if (debug) {
    runWithDebug({ day, part, example });
    return;
  }

  const { filePath, className } = getDay(day);
  await runDirectly({ part, example, filePath, className });
};

main();
