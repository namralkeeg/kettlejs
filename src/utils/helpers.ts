const primes = [
  3,
  7,
  11,
  17,
  23,
  29,
  37,
  47,
  59,
  71,
  89,
  107,
  131,
  163,
  197,
  239,
  293,
  353,
  431,
  521,
  631,
  761,
  919,
  1103,
  1327,
  1597,
  1931,
  2333,
  2801,
  3371,
  4049,
  4861,
  5839,
  7013,
  8419,
  10103,
  12143,
  14591,
  17519,
  21023,
  25229,
  30293,
  36353,
  43627,
  52361,
  62851,
  75431,
  90523,
  108631,
  130363,
  156437,
  187751,
  225307,
  270371,
  324449,
  389357,
  467237,
  560689,
  672827,
  807403,
  968897,
  1162687,
  1395263,
  1674319,
  2009191,
  2411033,
  2893249,
  3471899,
  4166287,
  4999559,
  5999471,
  7199369
];

const hashPrime = 101;

const isPrime = (candidate: number): boolean => {
  if ((candidate & 1) != 0) {
    const limit = Math.ceil(Math.sqrt(candidate));
    for (let divisor = 3; divisor <= limit; divisor += 2) {
      if (candidate % divisor === 0) {
        return false;
      }
    }
    return true;
  }

  return candidate === 2;
};

const getPrime = (min: number): number | undefined => {
  if (min < 0) {
    return undefined;
  }

  for (let i = 0, l = primes.length; i < l; i++) {
    if (primes[i] >= min) {
      return primes[i];
    }
  }

  for (let i = min | 1; i < Number.MAX_SAFE_INTEGER; i += 2) {
    if (isPrime(i) && (i - 1) % hashPrime !== 0) {
      return i;
    }
  }

  return min;
};

const getMinPrime = (): number => {
  return primes[0];
};

const isObject = (item: unknown): boolean => {
  return item && typeof item === "object" && !Array.isArray(item);
};

const isDefined = (item: unknown): boolean => {
  return typeof item != typeof undefined;
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

/**
 * Converts UTF-8 strings to {@link Uint8Array}
 */
const encoder: TextEncoder = new TextEncoder();

const hashCode = (input: string): number => {
  let hash = 2166136261;
  const uint8array: Uint8Array = encoder.encode(input);

  for (let i = 0, l = uint8array.length; i < l; i++) {
    hash ^= uint8array[i];
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return hash >>> 0;
};

const objectHasProperty = (
  obj: Record<string, unknown>,
  prop: string | number | symbol
): boolean => Object.prototype.hasOwnProperty.call(obj, prop);

export {
  hashCode,
  isObject,
  isDefined,
  isFunction,
  isString,
  defaultEqualityComparer,
  defaultComparer,
  isPrime,
  getPrime,
  getMinPrime,
  objectHasProperty
};
