// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IReadOnlyCollection<T> {
  count: number;
  contains(item: T): boolean;
  toArray(): Array<T>;
}

interface ICollection<T> {
  count: number;
  isReadOnly: boolean;
  add(item: T): void;
  clear(): void;
  contains(item: T): boolean;
  remove(item: T): boolean;
  toArray(): Array<T>;
}

interface IComparer<T> {
  (x: T, y: T): number;
}

interface IEqualityComparer<T> {
  (x: T, y: T): boolean;
}

interface ILoopCallback<T> {
  (x: T): boolean | null;
}

export { IReadOnlyCollection, ICollection, IComparer, IEqualityComparer, ILoopCallback };
