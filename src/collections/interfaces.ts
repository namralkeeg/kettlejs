// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface IReadOnlyCollection<T> {
  count: number;
}

interface ICollection<T> extends IReadOnlyCollection<T> {
  isReadOnly: number;
  add(item: T): void;
  clear(): void;
  contains(item: T): boolean;
  copyTo(arr: T[], arrayIndex: number): void;
  remove(item: T): boolean;
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
