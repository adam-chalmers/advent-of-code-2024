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

const main = async () => {
  const { day, part, example, debug } = await parser.parse();

  const { filePath, className } = getDay(day);
  let command = `node ${debug ? "--inspect" : ""} -r @swc-node/register ./src/dummy.ts -p ${part} -f ${filePath} -c ${className}`;
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

main();
