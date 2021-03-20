import spawn from 'cross-spawn';
import { Arguments, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';
import { propagateExitCode } from '../utils/processUtils';
import { getOutDir } from '../utils/tsconfigJsonUtils';

type CleanArgs = CommonArgs;

class Clean implements CommandModule<CommonArgs, CleanArgs> {
  command = 'clean';
  describe = `Delete any compiled TypeScript that resides in the tsconfig.json 'outDir' property`;
  handler = async (args: Arguments<CleanArgs>): Promise<void> => {
    const { verbose } = args;

    const outDir = getOutDir(verbose);
    if (!outDir) {
      throw new Error(`Unable to retrieve 'outDir' from tsconfig.json`);
    }

    verbose && console.log(`Deleting '${outDir}'`);
    const result = spawn.sync('rimraf', [outDir], {
      stdio: 'inherit',
    });
    propagateExitCode(result, 'rimraf');
  };
}

export default new Clean();
