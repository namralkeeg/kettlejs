import { defaultComparer } from "../utils/helpers";
import { IComparer } from "./interfaces";

abstract class BinaryHeap<T> {
  protected _growFactor = 2;
  protected _defaultCapacity = 8;

  protected _items: Array<T | undefined>;
  protected _count: number;
  protected _comparer: IComparer<T>;

  constructor(capacity?: number, comparer?: IComparer<T>) {
    this._count = 0;
    this._comparer = comparer ?? defaultComparer;
    this._items = new Array<T | undefined>();
    this.setCapacity(capacity ?? this._defaultCapacity);
  }

  protected setCapacity(capacity: number): void {
    if (capacity < 1) {
      throw new RangeError("Capacity must be greater than 0.");
    }

    if (capacity < this._count) {
      throw new RangeError("Capacity can't be less than the current size.");
    }

    if (this._items.length < capacity) {
      const newCapacity =
        capacity < this._defaultCapacity
          ? this._defaultCapacity
          : this._items.length * this._growFactor;

      if (newCapacity > this._items.length) {
        this._items.length = newCapacity;
      }
    }
  }

  protected left(i: number): number {
    return (i << 1) + 1; // i*2 + 1
  }

  protected parent(i: number): number {
    return Math.floor((i - 1) >> 1); // (i - 1) / 2
  }

  protected right(i: number): number {
    return (i << 1) + 2; // i*2 + 2
  }

  protected abstract findIndex(item: T): number;

  protected abstract siftDown(index: number): void;

  protected abstract siftUp(index: number): void;

  public get comparer(): IComparer<T> {
    return this._comparer;
  }

  public set comparer(comparer: IComparer<T>) {
    this._comparer = comparer ?? defaultComparer;
  }

  public get count(): number {
    return this._count;
  }

  public contains(item: T): boolean {
    return this.findIndex(item) === 0;
  }

  public peek(): T | undefined {
    if (this._count < 1) {
      return undefined;
    }

    return this._items[0];
  }

  public pop(): T | undefined {
    if (this._count < 1) {
      return undefined;
    }

    const root = this._items[0];
    if (this._count == 1) {
      this._items[0] = undefined;
      this._count--;
    } else {
      this._items[0] = this._items[this._count - 1];
      this._items[this._count - 1] = undefined;
      this._count--;

      if (this._count > 1) {
        this.siftDown(0);
      }
    }

    return root;
  }

  public push(item: T): void {
    if (this._count === this._items.length) {
      this.setCapacity(this._count + 1);
    }

    const index = this._count;
    this._count++;
    this._items[index] = item;

    if (this._count > 1) {
      this.siftUp(index);
    }
  }

  // public abstract remove(item: T): boolean;
}

export { BinaryHeap };
export default BinaryHeap;
