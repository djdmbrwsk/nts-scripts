[![build](https://img.shields.io/github/actions/workflow/status/djdmbrwsk/nts-scripts/lint-build-test.yml?branch=master)](https://github.com/djdmbrwsk/nts-scripts/actions?query=branch%3Amaster+workflow%3A%22Lint%2C+build%2C+test%22)
&nbsp;
[![npm](https://img.shields.io/npm/v/nts-scripts)](https://www.npmjs.com/package/nts-scripts)

# nts-scripts

Simple npm `scripts` and common `devDependencies` to help build a Node TypeScript app.

Inspired by Create React App's [react-scripts](https://github.com/facebook/create-react-app/tree/master/packages/react-scripts) package 👏

## Included dependencies

- TypeScript
- Jest
- Eslint
- Prettier
- Along with other TypeScript supporting dependencies. See the [package.json](package.json) file for the full list.

## Available scripts

### `build`

Compiles your TypeScript. Expects a `tsconfig.json` file with an `include` property and a `compilerOptions.outDir` property.

### `clean`

Deletes your compiled TypeScript. Expects a `tsconfig.json` file with a `compilerOptions.outDir` property.

### `format`

Runs `prettier` against all files. Uses your `.gitignore` file if it exists to ignore. Semi-customizable with args.

### `lint`

Runs `eslint` against all files. Uses your `.gitignore` file if it exists to ignore. Semi-customizable with args.

### `start`

Cleans, builds, and starts your Node project with debugging enabled. Targets the `main` property in your `package.json` first and falls back to the `outDir` property second. Semi-customizable with args.

### `watch`

Essentially the same as `start` except your project will re-build/start when changes are seen in your `outDir`. Semi-customizable with args.

### `test`

Run your project's Jest tests. Passes CLI args transparently to Jest (e.g., to run just one test suite, do `npm run test testName.test.ts`).

## Project requirements

### `tsconfig.json`

At a minimum the properties below are required. The values can be customized.

```json
{
  "compilerOptions": {
    "outDir": "./build"
  },
  "include": ["./src"]
}
```

### `.gitignore`

At least ignore the folders below. **NOTE:** If you customized the `outDir` in your `tsconfig.json`, update the `build` line here to match.

```
build
coverage
node_modules
```

### `.eslintrc.js`

An eslint config is required. Below is the simplest setup.

```js
module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
};
```

### `.importsortrc.js`

The config below is required.

```js
module.exports = {
  '.ts, .js': {
    style: 'module',
    parser: 'typescript',
  },
};
```

### `jest.config.js`

At a minimum the config below is required. **NOTE:** If you customized the `outDir` in your `tsconfig.json`, update `'<rootDir>/build/'` to match.

```js
module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
};
```

## Project recommendations

### `.prettierrc.js`

It's recommended you setup a Prettier [configuration file](https://prettier.io/docs/en/configuration.html).

### `.nvmrc`

Using `nvm` along with an `.nvmrc` file to [automatically](https://github.com/nvm-sh/nvm#deeper-shell-integration) switch to the appropriate version of Node can be extremely helpful.

### `.vscode/settings.json`

If you're using VS Code, a project-level settings file may be helpful to customize your experience.
