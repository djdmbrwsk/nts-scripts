import { SpawnSyncReturns } from 'child_process';

import yargs from 'yargs';

export function propagateExitCode(
  result: SpawnSyncReturns<Buffer>,
  targetCommand: string,
): void {
  if (result.status !== 0) {
    yargs.exit(
      result.status || 1,
      result.error || new Error(`Non-zero exit from ${targetCommand}`),
    );
  }
}
