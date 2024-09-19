export const extractPath = <T>(callback: (obj: T) => any): string[] => {
  const fn = callback.toString();
  const match = fn.match(/\(\w+\)\s*=>\s*\w+(.[\w.]+)/);
  if (match) {
    return match[1].split('.').filter(Boolean);
  }
  return [];
};
