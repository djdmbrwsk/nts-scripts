import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTsconfigJson(verbose?: boolean): any {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (!fs.existsSync(tsconfigPath)) {
    verbose && console.log(`No tsconfig.json exists at '${tsconfigPath}'`);
    return undefined;
  }

  verbose && console.log(`Loading tsconfig.json at '${tsconfigPath}'`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const tsconfig = require(tsconfigPath);
  return tsconfig;
}

export function getInclude(verbose?: boolean): string[] | undefined {
  const tsconfig = getTsconfigJson(verbose);
  if (!tsconfig) {
    return undefined;
  }

  const include = tsconfig.include;
  if (!include) {
    verbose && console.log(`No 'include' property found`);
    return undefined;
  }
  if (!Array.isArray(include)) {
    verbose && console.log(`The 'include' property isn't an array`);
    return undefined;
  }
  if (include.length < 1) {
    verbose && console.log(`The 'include' is empty`);
    return undefined;
  }
  if (typeof include[0] !== 'string') {
    verbose && console.log(`The 'include' property isn't a string array`);
    return undefined;
  }
  return include;
}

export function getOutDir(verbose?: boolean): string | undefined {
  const tsconfig = getTsconfigJson(verbose);
  if (!tsconfig) {
    return undefined;
  }

  const outDir = tsconfig.compilerOptions?.outDir;
  if (!outDir) {
    verbose && console.log(`No 'compilerOptions.outDir' property found`);
    return undefined;
  }
  if (typeof outDir !== 'string') {
    verbose && console.log(`The 'outDir' property isn't a string`);
    return undefined;
  }
  return outDir;
}
