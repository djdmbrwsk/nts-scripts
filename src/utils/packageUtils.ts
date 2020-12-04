import fs from 'fs';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPackageJson(verbose?: boolean): any {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    verbose && console.log(`No package.json exists at '${packageJsonPath}'`);
    return undefined;
  }

  verbose && console.log(`Loading package.json at '${packageJsonPath}'`);
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const packageJson = require(packageJsonPath);
  return packageJson;
}

export function getMain(verbose?: boolean): string | undefined {
  const packageJson = getPackageJson(verbose);
  if (!packageJson) {
    return undefined;
  }

  const main = packageJson.main;
  if (!main) {
    verbose && console.log(`No 'main' property found`);
    return undefined;
  }
  if (typeof main !== 'string') {
    verbose && console.log(`The 'main' property isn't a string`);
    return undefined;
  }
  return main;
}
