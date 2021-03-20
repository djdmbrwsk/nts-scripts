import spawn from 'cross-spawn';
import { Arguments, Argv, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';
import { propagateExitCode } from '../utils/processUtils';
import { getInclude, getOutDir } from '../utils/tsconfigJsonUtils';

interface BuildArgs extends CommonArgs {
  incremental: boolean;
}

class Build implements CommandModule<CommonArgs, BuildArgs> {
  command = 'build';
  describe = `Compile the TypeScript identified by the tsconfig.json 'include' property`;
  builder = (args: Argv<CommonArgs>): Argv<BuildArgs> => {
    return args.option('incremental', {
      boolean: true,
      default: false,
      describe: 'Pass the --incremental flag to tsc (used by watch)',
    });
  };
  handler = async (args: Arguments<BuildArgs>): Promise<void> => {
    const { incremental, verbose } = args;

    const include = getInclude(verbose);
    if (!include) {
      throw new Error(
        `Unable to retrieve 'include' property from tsconfig.json`,
      );
    }
    const outDir = getOutDir(verbose);
    if (!outDir) {
      throw new Error(`Unable to retrieve 'outDir' from tsconfig.json`);
    }

    const tscArgs: string[] = [];
    if (incremental) {
      tscArgs.push('--incremental');
    }

    verbose && console.log(`Compiling included TypeScript: `, include);
    const result = spawn.sync('tsc', [...tscArgs], {
      stdio: 'inherit',
    });
    propagateExitCode(result, 'tsc');
  };
}

export default new Build();
