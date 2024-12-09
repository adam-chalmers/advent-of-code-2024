import yargs from "yargs";
import { Day } from "./common/day";
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
  })
  .option("filePath", {
    alias: "f",
    type: "string",
    description: "The file to load",
    requiresArg: true,
    demandOption: true,
  })
  .option("className", {
    alias: "c",
    type: "string",
    description: "The name of the class to load",
    requiresArg: true,
    demandOption: true,
  });

const main = async () => {
  const { part, example, filePath, className } = await parser.parse();

  if (part !== 1 && part !== 2) {
    console.error(`Invalid part entered: ${part}`);
    process.exitCode = 1;
    return;
  }

  const imported = await import(filePath);
  const DayClass = imported[className] as new () => Day;

  new DayClass().run({ example, part });
};

main();
