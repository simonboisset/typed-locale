import {expect, test} from 'vitest';
import {getDeep, updateDeep} from './deep';

test('getDeep should retrieve nested values', () => {
  const obj = {a: {b: {c: '1'}}};
  const path = ['a', 'b', 'c'];

  const result = getDeep(obj, path);

  expect(result).toBe('1');
});

test('getDeep should return undefined for non-existent paths', () => {
  const obj = {a: {b: {c: '1'}}};
  const path = ['a', 'b', 'd'];

  const result = getDeep(obj, path);

  expect(result).toBeUndefined();
});

test('getDeep should handle empty objects', () => {
  const obj = {};
  const path = ['a', 'b', 'c'];

  const result = getDeep(obj, path);

  expect(result).toBeUndefined();
});

test('getDeep should handle empty paths', () => {
  const obj = {a: {b: {c: '1'}}};
  const path: string[] = [];

  const result = getDeep(obj, path);

  expect(result).toEqual(obj);
});

test('updateDeep should update nested objects', () => {
  const obj = {a: {b: {c: '1'}}};
  const path = ['a', 'b', 'c'];
  const value = '2';

  const result = updateDeep(obj, value, path);

  expect(result).toEqual({a: {b: {c: '2'}}});
  expect(obj).toEqual({a: {b: {c: '1'}}}); // Original object should not be modified
});

test('updateDeep should create nested objects if they do not exist', () => {
  const obj = {};
  const path = ['a', 'b', 'c'];
  const value = '1';

  const result = updateDeep(obj, value, path);

  expect(result).toEqual({a: {b: {c: '1'}}});
});

test('updateDeep should not modify the original object', () => {
  const obj = {a: {b: '1'}};
  const path = ['a', 'b'];
  const value = '2';

  const result = updateDeep(obj, value, path);

  expect(result).toEqual({a: {b: '2'}});
  expect(obj).toEqual({a: {b: '1'}});
});
