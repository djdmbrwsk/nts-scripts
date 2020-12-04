import { getMain } from './packageUtils';
import { getOutDir } from './tsconfigJsonUtils';

export function getMainDefault(verbose?: boolean): string {
  let main = getMain(verbose);
  if (main) {
    verbose && console.log(`Using package.json 'main' property '${main}'`);
    return main;
  }

  main = getOutDir(verbose);
  if (main) {
    verbose && console.log(`Using tsconfig.json 'outDir' property '${main}'`);
    return main;
  }

  throw new Error(`Unable to determine 'main' file`);
}
