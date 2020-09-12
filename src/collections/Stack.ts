import { IReadOnlyCollection, IEqualityComparer, ILoopCallback } from "./interfaces";
import { defaultEqualityComparer } from "../utils/helpers";

const defaultCapacity = 4;

class Stack<T> implements IReadOnlyCollection<T> {
  private _storage: Array<unknown>;
  private _size: number;
  private readonly _initialCapacity: number;
  private _comparer: IEqualityComparer<T>;

  constructor(
    capacity: number = defaultCapacity,
    comparer: IEqualityComparer<T> = defaultEqualityComparer
  ) {
    this._initialCapacity = capacity;
    this._storage = new Array(this._initialCapacity);
    this._size = 0;
    this._comparer = comparer;
  }

  public get comparer(): IEqualityComparer<T> {
    return this._comparer;
  }

  public set comparer(comparer: IEqualityComparer<T>) {
    this._comparer = comparer;
  }

  public get count(): number {
    return this._size;
  }

  public get isEmpty(): boolean {
    return this._size <= 0;
  }

  public clear(): void {
    this._storage = new Array(this._initialCapacity);
    this._size = 0;
  }

  public contains(item: T, comparer?: IEqualityComparer<T>): boolean {
    let pos = this._size;
    const equals = comparer || this._comparer || defaultEqualityComparer;

    while (pos-- > 0) {
      if (equals(item, this._storage[pos] as T)) {
        return true;
      }
    }

    return false;
  }

  public trimExcess(): void {
    const threshold = Math.floor(this._storage.length * 0.9);

    if (this._size < threshold) {
      const smaller = this._storage.slice(0, this._size);
      this._storage = smaller;
    }
  }

  public peek(): T | null {
    if (this._size === 0 || this._storage[this._size - 1] == null) {
      return null;
    }

    return this._storage[this._size - 1] as T;
  }

  public pop(): T | null {
    if (this._size === 0 || this._storage[this._size - 1] == null) {
      return null;
    }

    const item: T = this._storage[this._size - 1] as T;
    this._storage[--this._size] = null;

    return item;
  }

  public push(item: T): void {
    if (this._size === this._storage.length) {
      this._storage.length =
        this._storage.length == 0 ? defaultCapacity : this._storage.length * 2;
    }

    this._storage[this._size++] = item;
  }

  public add(item: T): void {
    this.push(item);
  }

  public forEach(callback: ILoopCallback<T>): void {
    for (let i = this._size - 1; i >= 0; i--) {
      this._storage[i] = callback(this._storage[i] as T);
    }
  }

  public toArray(): Array<T> {
    return this._storage.slice(0, this._size).reverse() as Array<T>;
  }
}

export { Stack };
export default Stack;
