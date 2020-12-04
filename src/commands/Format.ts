import fs from 'fs';
import path from 'path';

import spawn from 'cross-spawn';
import { Arguments, Argv, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';

interface FormatArgs extends CommonArgs {
  disableGitignore: boolean;
  glob: string;
}

class Format implements CommandModule<CommonArgs, FormatArgs> {
  command = 'format';
  describe = `Format supported file types`;
  builder = (args: Argv<CommonArgs>): Argv<FormatArgs> => {
    return args
      .option('disableGitignore', {
        alias: 'disable-gitignore',
        boolean: true,
        default: false,
        describe: 'Disable ignoring via .gitignore',
      })
      .option('glob', {
        default: '.',
        describe: 'Glob for formatting',
        string: true,
      });
  };
  handler = async (args: Arguments<FormatArgs>): Promise<void> => {
    const { disableGitignore, glob, verbose } = args;

    const ignorePathArgs: string[] = [];
    if (!disableGitignore) {
      const gitignorePath = path.join(process.cwd(), '.gitignore');
      if (fs.existsSync(gitignorePath)) {
        verbose && console.log('Ignoring based on .gitignore');
        ignorePathArgs.push('--ignore-path', '.gitignore');
      } else {
        verbose && console.log('Ignore disabled; no .gitignore found');
      }
    } else {
      verbose && console.log('Ignore disabled by user');
    }

    verbose && console.log(`Formatting files: `, glob);
    spawn.sync('prettier', [...ignorePathArgs, '--write', glob], {
      stdio: 'inherit',
    });
  };
}

export default new Format();
