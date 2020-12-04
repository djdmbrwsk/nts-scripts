import spawn from 'cross-spawn';
import { Arguments, Argv, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';
import { getMainDefault } from '../utils/argUtils';
import { getOutDir } from '../utils/tsconfigJsonUtils';

interface WatchArgs extends CommonArgs {
  debugPort: number;
  disableDebug: boolean;
  main?: string;
}

class Watch implements CommandModule<CommonArgs, WatchArgs> {
  command = 'watch';
  describe = `Build and start a Node project`;
  builder = (args: Argv<CommonArgs>): Argv<WatchArgs> => {
    return args
      .option('debugPort', {
        default: 9229,
        describe: 'Change debug port',
        number: true,
      })
      .option('disableDebug', {
        alias: 'disable-debug',
        boolean: true,
        default: false,
        describe: 'Disable Node debugging',
      })
      .option('main', {
        describe: 'The main file (entry-point) of your project',
        string: true,
      });
  };
  handler = async (args: Arguments<WatchArgs>): Promise<void> => {
    const { debugPort, disableDebug, verbose } = args;
    const { main = getMainDefault(verbose) } = args;

    const nodemonArgs: string[] = [];
    const outDir = getOutDir(verbose);
    if (!outDir) {
      throw new Error(`Unable to retrieve 'outDir' from tsconfig.json`);
    }
    nodemonArgs.push('--watch', outDir);
    if (!disableDebug) {
      nodemonArgs.push(`--inspect=0.0.0.0:${debugPort}`);
    }
    nodemonArgs.push(main);

    const tscArgs = ['--watch', '--incremental', '--preserveWatchOutput'];

    verbose && console.log('Cleaning and building incrementally');
    spawn.sync('npm', ['run', 'clean'], {
      stdio: 'inherit',
    });
    spawn.sync('npm', ['run', 'build', '--', '--incremental'], {
      stdio: 'inherit',
    });

    spawn.sync(
      'concurrently',
      [
        '-k',
        '-n',
        'TypeScript,Node',
        '-c',
        'yellow.bold,cyan.bold',
        `tsc ${tscArgs.join(' ')}`,
        `nodemon ${nodemonArgs.join(' ')}`,
      ],
      {
        stdio: 'inherit',
      },
    );
  };
}

export default new Watch();
