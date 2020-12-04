import fs from 'fs';

import { getTsconfigJson } from './tsconfigJsonUtils';

describe('getTsconfigJson()', () => {
  test('should return undefined when tsconfig.json not found', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    const res = getTsconfigJson();
    expect(res).toEqual(undefined);
  });
});
