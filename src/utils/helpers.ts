const isObject = (item: unknown): boolean => {
  return item && typeof item === "object" && !Array.isArray(item);
};

const isDefined = (item: unknown): boolean => {
  return item && typeof item !== "undefined";
};

const isFunction = (item: unknown): boolean => {
  return item && typeof item === typeof Function;
};

const isString = (item: unknown): boolean => {
  return typeof item === "string" || item instanceof String;
};

const defaultEqualityComparer = <T>(x: T, y: T): boolean => {
  return x === y;
};

const defaultComparer = <T>(x: T, y: T): number => {
  if (x < y) {
    return -1;
  }

  if (x === y) {
    return 0;
  }

  return 1;
};

export { isObject, isDefined, isFunction, isString, defaultEqualityComparer, defaultComparer };
