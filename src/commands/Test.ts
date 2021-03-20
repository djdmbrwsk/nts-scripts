import spawn from 'cross-spawn';
import { Arguments, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';
import { propagateExitCode } from '../utils/processUtils';

type TestArgs = CommonArgs;

class Test implements CommandModule<CommonArgs, TestArgs> {
  command = 'test';
  describe = `Run tests`;
  handler = async (args: Arguments<TestArgs>): Promise<void> => {
    const { verbose } = args;

    verbose && console.log('Running tests');
    const result = spawn.sync(
      'jest',
      ['--coverage', '--runInBand', '--verbose'],
      {
        stdio: 'inherit',
      },
    );
    propagateExitCode(result, 'jest');
  };
}

export default new Test();
