# Advent of Code 2024

## Setup

Written using node 22 and built to use yarn 4. Simply run `yarn` (use `corepack enable` first if you haven't already) to setup. No TypeScript building should be necessary as all code runs using `ts-node` (using swc as a compiler for speed).

If you want to use scripts (see below) to initialise new days and pull inputs automatically:
1. Create a new, empty file in the root of this repository named `.token`.
2. In a browser, go to adventofcode.com and log in.
3. Open a dev console and find your cookies for adventofcode.com.
4. Copy the value out of the `session` cookie and into the file created in step 1.

## Scripts

### New

`yarn new` will create a new folder for each missing day based on the current time and when new puzzles are released. For each day, it creates a new `main.ts` file filled with template code, as well as pulling that day's example into a new `input.txt`. It also creates a blank `example.txt` that you can paste any example inputs into if you want to run your code against the day's example input.

### Day

`yarn day` will run the code for the current day. There are two arguments (you can also run `yarn day --help` to see this in your terminal):
- `-p` or `--part` - either 1 or 2, and denotes which part of the day's challenge you want to run
- `--example` - if given, will run against the input in that day's `example.txt`. If omitted, will run against `input.txt` instead.

For example, run `yarn day -p 1 --example` to run your code for the latest day's part 1, using the example input.

The command will print the answer as returned by your code, as well as tell you how long it took to run.