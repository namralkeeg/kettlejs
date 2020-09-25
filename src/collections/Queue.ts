import { IReadOnlyCollection, IEqualityComparer, ILoopCallback } from "./interfaces";
import { defaultEqualityComparer } from "../utils/helpers";

const defaultCapacity = 4;

class Queue<T> implements IReadOnlyCollection<T>, Iterable<T> {
  private storage: Array<unknown>;
  private size: number;
  private head: number;
  private tail: number;
  private internalComparer: IEqualityComparer<T>;

  private readonly _initialCapacity: number;
  private readonly _minimumGrow = 4;
  private readonly _growFactor = 2;

  constructor(
    capacity: number = defaultCapacity,
    comparer: IEqualityComparer<T> = defaultEqualityComparer
  ) {
    this._initialCapacity = capacity < defaultCapacity ? defaultCapacity : capacity;
    this.storage = new Array(this._initialCapacity);
    this.size = 0;
    this.head = 0;
    this.tail = 0;
    this.internalComparer = comparer;
  }

  private setCapacity(capacity: number): void {
    const newArray = new Array<unknown>(capacity);

    if (this.size > 0) {
      if (this.head < this.tail) {
        newArray.splice(0, this.size, this.storage.slice(this.head, this.storage.length));
      } else {
        newArray.splice(
          0,
          this.storage.length - this.head,
          this.storage.slice(this.head, this.storage.length)
        );
        newArray.splice(
          this.storage.length - this.head,
          this.tail,
          this.storage.slice(0, this.tail)
        );
      }
    }

    this.storage = newArray;
    this.head = 0;
    this.tail = this.size == capacity ? 0 : this.size;
  }

  private getElement(index: number): T | undefined {
    if (index >= this.size) {
      return undefined;
    }

    return this.storage[(this.head + index) % this.storage.length] as T;
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

  public get isReadOnly(): boolean {
    return false;
  }

  [Symbol.iterator](): Iterator<T> {
    const storage = this.storage;
    const size = this.size;
    let index = this.head;
    let count = size;

    const iterator = {
      next(): IteratorResult<T> {
        let item: IteratorResult<T>;

        if (count-- < 0) {
          item = { value: undefined, done: true };
        } else {
          item = { value: storage[index] as T, done: false };
          index = (index + 1) % size;
        }

        return item;
      }
    };

    return iterator;
  }

  public clear(): void {
    this.storage = new Array(this._initialCapacity);
    this.size = 0;
    this.head = 0;
    this.tail = 0;
  }

  public enqueue(item: T): void {
    if (this.size == this.storage.length) {
      let newCapacity = this.storage.length * this._growFactor;
      if (newCapacity < this.storage.length + this._minimumGrow) {
        newCapacity = this.storage.length + this._minimumGrow;
      }
      this.setCapacity(newCapacity);
    }

    this.storage[this.tail] = item;
    this.tail = (this.tail + 1) % this.storage.length;
    this.size++;
  }

  public add(item: T): void {
    this.enqueue(item);
  }

  public dequeue(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    const removed = this.storage[this.head] as T;
    this.storage[this.head] = undefined;
    this.head = (this.head + 1) % this.storage.length;
    this.size--;

    return removed;
  }

  public peek(): T | undefined {
    if (this.size === 0) {
      return undefined;
    }

    return this.storage[this.head] as T;
  }

  public contains(item: T, comparer?: IEqualityComparer<T>): boolean {
    const equals = comparer || this.internalComparer || defaultEqualityComparer;
    let index = this.head;
    let count = this.size;

    while (count-- > 0) {
      if (equals(item, this.storage[index] as T)) {
        return true;
      }
      index = (index + 1) % this.storage.length;
    }

    return false;
  }

  public forEach(callback: ILoopCallback<T>): void {
    let index = this.head;
    let count = this.size;

    while (count-- > 0) {
      callback(this.storage[index] as T);
      index = (index + 1) % this.storage.length;
    }
  }

  public toArray(): Array<T> {
    const newArray = new Array<T>();

    if (this.size > 0) {
      if (this.head < this.tail) {
        newArray.concat(this.storage.slice(this.head, this.storage.length) as Array<T>);
      } else {
        newArray.concat(this.storage.slice(this.head, this.storage.length) as Array<T>);
        newArray.concat(this.storage.slice(0, this.tail) as Array<T>);
      }
    }

    return newArray;
  }

  public trimExcess(): void {
    const threshold = Math.floor(this.size * 0.9);
    if (this.size < threshold) {
      this.setCapacity(threshold);
    }
  }
}

export { Queue };
export default Queue;
