import spawn from 'cross-spawn';
import { Arguments, CommandModule } from 'yargs';

import { CommonArgs } from '../bin/nts-scripts';
import { propagateExitCode } from '../utils/processUtils';

type TestArgs = CommonArgs;

class Test implements CommandModule<CommonArgs, TestArgs> {
  command = 'test';
  describe = `Run tests`;
  handler = async (args: Arguments<TestArgs>): Promise<void> => {
    const { _, verbose } = args;

    let jestArgs = ['--coverage', '--runInBand', '--verbose'];
    const extraArgs = _[0] === this.command ? _.slice(1) : _;
    if (extraArgs.length) {
      verbose && console.log('Forwarding extra args');
      jestArgs = extraArgs;
    }

    verbose && console.log('Running tests');
    const result = spawn.sync('jest', jestArgs, {
      stdio: 'inherit',
    });
    propagateExitCode(result, 'jest');
  };
}

export default new Test();
