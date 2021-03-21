#!/usr/bin/env node

import yargs from 'yargs';

import Build from '../commands/Build';
import Clean from '../commands/Clean';
import Format from '../commands/Format';
import Lint from '../commands/Lint';
import Start from '../commands/Start';
import Test from '../commands/Test';
import Watch from '../commands/Watch';

export interface CommonArgs {
  verbose: boolean;
}

yargs
  .option('verbose', {
    default: false,
    describe: 'Log detailed output for debugging',
    boolean: true,
  })
  .command(Build)
  .command(Clean)
  .command(Format)
  .command(Lint)
  .command(Start)
  .command(Test)
  .command(Watch)
  .help()
  .version()
  .demandCommand(1, 'You need at least one command before moving on').argv;
