import { IReadOnlyCollection, IEqualityComparer, ILoopCallback } from "../common/interfaces";
import { defaultEqualityComparer } from "../utils/helpers";

const defaultCapacity = 4;

class Stack<T> implements IReadOnlyCollection<T>, Iterable<T> {
  private storage: Array<unknown>;
  private size: number;
  private readonly initialCapacity: number;
  private internalComparer: IEqualityComparer<T>;

  constructor(
    capacity: number = defaultCapacity,
    comparer: IEqualityComparer<T> = defaultEqualityComparer
  ) {
    this.initialCapacity = capacity;
    this.storage = new Array(this.initialCapacity);
    this.size = 0;
    this.internalComparer = comparer ?? defaultEqualityComparer;
  }

  [Symbol.iterator](): Iterator<T> {
    const storage = this.storage;
    let index = this.size - 1;

    const iterator = {
      next(): IteratorResult<T> {
        if (index < 0) {
          return { value: undefined, done: true };
        } else {
          return { value: storage[index--] as T, done: false };
        }
      }
    };

    return iterator;
  }

  public get comparer(): IEqualityComparer<T> {
    return this.internalComparer;
  }

  public set comparer(comparer: IEqualityComparer<T>) {
    this.internalComparer = comparer ?? defaultEqualityComparer;
  }

  public get count(): number {
    return this.size;
  }

  public get isEmpty(): boolean {
    return this.size <= 0;
  }

  public clear(): void {
    this.storage = new Array(this.initialCapacity);
    this.size = 0;
  }

  public contains(item: T, comparer?: IEqualityComparer<T>): boolean {
    let pos = this.size;
    const equals = comparer || this.internalComparer || defaultEqualityComparer;

    while (pos-- > 0) {
      if (equals(item, this.storage[pos] as T)) {
        return true;
      }
    }

    return false;
  }

  public trimExcess(): void {
    const threshold = Math.floor(this.storage.length * 0.9);

    if (this.size < threshold) {
      const smaller = this.storage.slice(0, this.size);
      this.storage = smaller;
    }
  }

  public peek(): T | undefined {
    if (this.size === 0 || this.storage[this.size - 1] == undefined) {
      return undefined;
    }

    return this.storage[this.size - 1] as T;
  }

  public pop(): T | undefined {
    if (this.size === 0 || this.storage[this.size - 1] == undefined) {
      return undefined;
    }

    const item: T = this.storage[this.size - 1] as T;
    this.storage[--this.size] = undefined;

    return item;
  }

  public push(item: T): void {
    if (this.size === this.storage.length) {
      this.storage.length =
        this.storage.length === 0 ? defaultCapacity : this.storage.length * 2;
    }

    this.storage[this.size++] = item;
  }

  public add(item: T): void {
    this.push(item);
  }

  public forEach(callback: ILoopCallback<T>): void {
    for (let i = this.size - 1; i >= 0; i--) {
      callback(this.storage[i] as T);
    }
  }

  public toArray(): Array<T> {
    return this.storage.slice(0, this.size).reverse() as Array<T>;
  }
}

export { Stack };
export default Stack;
