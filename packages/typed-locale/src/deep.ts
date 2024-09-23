export const updateDeep = <T extends object>(obj: T, value: string, path: string[]): T => {
  const keys = path;
  const [currentKey, ...restKeys] = keys;

  if (restKeys.length === 0) {
    return {...obj, [currentKey]: value};
  }

  return {
    ...obj,
    [currentKey]: updateDeep((obj as any)[currentKey] || {}, value, restKeys),
  };
};

export const getDeep = <T extends object>(obj: T, path: string[]): string | undefined => {
  const [currentKey, ...restKeys] = path;

  if (obj === undefined) {
    return undefined;
  }

  if (currentKey === undefined) {
    return obj as any;
  }

  const value = (obj as any)[currentKey];

  if (restKeys.length === 0) {
    return value;
  }

  return getDeep(value, restKeys);
};
