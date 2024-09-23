import {expect, test} from 'vitest';
import {extractPath} from './extract-path';

test('extractPath should extract the correct path', () => {
  const selector = (t: any) => t.nested.deep.value;
  const path = extractPath(selector);
  expect(path).toEqual(['nested', 'deep', 'value']);
});

test('extractPath should handle root-level properties', () => {
  const selector = (t: any) => t.rootValue;
  const path = extractPath(selector);
  expect(path).toEqual(['rootValue']);
});

test('extractPath should handle empty selectors', () => {
  const selector = (t: any) => t;
  const path = extractPath(selector);
  expect(path).toEqual([]);
});

test('extractPath should handle complex selectors', () => {
  const selector = (t: any) => t.very.deep.nested.structure.with.many.levels;
  const path = extractPath(selector);
  expect(path).toEqual(['very', 'deep', 'nested', 'structure', 'with', 'many', 'levels']);
});
