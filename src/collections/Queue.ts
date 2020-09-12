import { IReadOnlyCollection, IEqualityComparer, ILoopCallback } from "./interfaces";
import { defaultEqualityComparer } from "../utils/helpers";

const defaultCapacity = 4;

class Queue<T> implements IReadOnlyCollection<T> {
  private _storage: Array<unknown>;
  private _size: number;
  private _head: number;
  private _tail: number;
  private _comparer: IEqualityComparer<T>;

  private readonly _initialCapacity: number;
  private readonly _minimumGrow = 4;
  private readonly _growFactor = 2;

  constructor(
    capacity: number = defaultCapacity,
    comparer: IEqualityComparer<T> = defaultEqualityComparer
  ) {
    this._initialCapacity = capacity < defaultCapacity ? defaultCapacity : capacity;
    this._storage = new Array(this._initialCapacity);
    this._size = 0;
    this._head = 0;
    this._tail = 0;
    this._comparer = comparer;
  }

  private setCapacity(capacity: number): void {
    const newArray = new Array<unknown>(capacity);

    if (this._size > 0) {
      if (this._head < this._tail) {
        newArray.splice(0, this._size, this._storage.slice(this._head, this._storage.length));
      } else {
        newArray.splice(
          0,
          this._storage.length - this._head,
          this._storage.slice(this._head, this._storage.length)
        );
        newArray.splice(
          this._storage.length - this._head,
          this._tail,
          this._storage.slice(0, this._tail)
        );
      }
    }

    this._storage = newArray;
    this._head = 0;
    this._tail = this._size == capacity ? 0 : this._size;
  }

  private getElement(index: number): T | undefined {
    if (index >= this._size) {
      return undefined;
    }

    return this._storage[(this._head + index) % this._storage.length] as T;
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

  public get isReadOnly(): boolean {
    return false;
  }

  public clear(): void {
    this._storage = new Array(this._initialCapacity);
    this._size = 0;
    this._head = 0;
    this._tail = 0;
  }

  public enqueue(item: T): void {
    if (this._size == this._storage.length) {
      let newCapacity = this._storage.length * this._growFactor;
      if (newCapacity < this._storage.length + this._minimumGrow) {
        newCapacity = this._storage.length + this._minimumGrow;
      }
      this.setCapacity(newCapacity);
    }

    this._storage[this._tail] = item;
    this._tail = (this._tail + 1) % this._storage.length;
    this._size++;
  }

  public add(item: T): void {
    this.enqueue(item);
  }

  public dequeue(): T | undefined {
    if (this._size === 0) {
      return undefined;
    }

    const removed = this._storage[this._head] as T;
    this._storage[this._head] = undefined;
    this._head = (this._head + 1) % this._storage.length;
    this._size--;

    return removed;
  }

  public peek(): T | undefined {
    if (this._size === 0) {
      return undefined;
    }

    return this._storage[this._head] as T;
  }

  public contains(item: T, comparer?: IEqualityComparer<T>): boolean {
    const equals = comparer || this._comparer || defaultEqualityComparer;
    let index = this._head;
    let count = this._size;

    while (count-- > 0) {
      if (equals(item, this._storage[index] as T)) {
        return true;
      }
      index = (index + 1) % this._storage.length;
    }

    return false;
  }

  public forEach(callback: ILoopCallback<T>): void {
    let index = this._head;
    let count = this._size;

    while (count-- > 0) {
      this._storage[index] = callback(this._storage[index] as T);
      index = (index + 1) % this._storage.length;
    }
  }

  public toArray(): Array<T> {
    const newArray = new Array<T>();

    if (this._size > 0) {
      if (this._head < this._tail) {
        newArray.concat(this._storage.slice(this._head, this._storage.length) as Array<T>);
      } else {
        newArray.concat(this._storage.slice(this._head, this._storage.length) as Array<T>);
        newArray.concat(this._storage.slice(0, this._tail) as Array<T>);
      }
    }

    return newArray;
  }

  public trimExcess(): void {
    const threshold = Math.floor(this._size * 0.9);
    if (this._size < threshold) {
      this.setCapacity(threshold);
    }
  }
}

export { Queue };
export default Queue;
