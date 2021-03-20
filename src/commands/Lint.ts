import fs from 'fs';
import path from 'path';

import spawn from 'cross-spawn';
import { Arguments, Argv, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';
import { propagateExitCode } from '../utils/processUtils';

interface LintArgs extends CommonArgs {
  disableMaxWarnings: boolean;
  glob: string;
}

class Lint implements CommandModule<CommonArgs, LintArgs> {
  command = 'lint';
  describe = `Lint ts/js files`;
  builder = (args: Argv<CommonArgs>): Argv<LintArgs> => {
    return args
      .option('disableGitignore', {
        alias: 'disable-gitignore',
        boolean: true,
        default: false,
        describe: 'Disable ignoring via .gitignore',
      })
      .option('disableMaxWarnings', {
        alias: 'disable-max-warnings',
        boolean: true,
        default: false,
        describe: 'Disable erroring when more than one lint issue',
      })
      .option('glob', {
        default: '**/*.{ts,js}',
        describe: 'Glob for linting',
        string: true,
      });
  };
  handler = async (args: Arguments<LintArgs>): Promise<void> => {
    const { disableGitignore, disableMaxWarnings, glob, verbose } = args;

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

    const maxWarningsArgs: string[] = [];
    if (!disableMaxWarnings) {
      verbose && console.log('Max warnings set to 0');
      maxWarningsArgs.push('--max-warnings', '0');
    } else {
      verbose && console.log('Max warnings disabled by user');
    }

    verbose && console.log(`Linting files: `, glob);
    const result = spawn.sync(
      'eslint',
      [...ignorePathArgs, ...maxWarningsArgs, glob],
      {
        stdio: 'inherit',
      },
    );
    propagateExitCode(result, 'eslint');
  };
}

export default new Lint();
