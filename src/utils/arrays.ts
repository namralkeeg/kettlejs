const copy = <T>(source: T[]): T[] => {
  return [...source];
};

const deepCopy = <T>(source: T[]): T[] => {
  return JSON.parse(JSON.stringify(source));
};

const swap = <T>(array: T[], i: number, j: number): boolean => {
  if (i < 0 || i >= array.length || j < 0 || j >= array.length || j <= i) {
    return false;
  }

  const temp = array[i];
  array[i] = array[j];
  array[j] = temp;
  return true;
};

export { copy, deepCopy, swap };
