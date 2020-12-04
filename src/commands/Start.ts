import spawn from 'cross-spawn';
import { Arguments, Argv, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';
import { getMainDefault } from '../utils/argUtils';

interface StartArgs extends CommonArgs {
  debugPort: number;
  disableDebug: boolean;
  main?: string;
}

class Start implements CommandModule<CommonArgs, StartArgs> {
  command = 'start';
  describe = `Build and start a Node project`;
  builder = (args: Argv<CommonArgs>): Argv<StartArgs> => {
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
  handler = async (args: Arguments<StartArgs>): Promise<void> => {
    const { debugPort, disableDebug, verbose } = args;
    const { main = getMainDefault(verbose) } = args;

    const nodeArgs: string[] = [];
    if (!disableDebug) {
      nodeArgs.push(`--inspect=0.0.0.0:${debugPort}`);
    }
    nodeArgs.push(main);

    verbose && console.log('Cleaning and building');
    spawn.sync('npm', ['run', 'clean'], {
      stdio: 'inherit',
    });
    spawn.sync('npm', ['run', 'build'], {
      stdio: 'inherit',
    });

    spawn.sync(
      'concurrently',
      ['-n', 'Node', '-c', 'cyan.bold', `node ${nodeArgs.join(' ')}`],
      {
        stdio: 'inherit',
      },
    );
  };
}

export default new Start();
