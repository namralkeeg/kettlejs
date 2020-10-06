import BinaryHeap from "./BinaryHeap";
import { IComparer } from "./interfaces";
import { swap } from "../utils/arrays";

class MaxBinaryHeap<T> extends BinaryHeap<T> {
  constructor(capacity?: number, comparer?: IComparer<T>) {
    super(capacity, comparer);
  }

  protected findIndex(item: T): number {
    return this._items.findIndex((x) => this._comparer(x as T, item) == 0);
  }

  protected siftDown(index: number): void {
    const left = this.left(index);
    const right = this.right(index);
    let largest = 0;

    if (this._count < left) {
      // There's no children. Do nothing.
      return;
    }

    // If there is only a left child of this node
    if (this._count === left) {
      // Do a comparison and swap if the parent is smaller.
      if (this._comparer(this._items[index] as T, this._items[left] as T) < 0) {
        swap(this._items, index, left);
      }

      return;
    } else {
      // If both children are there
      // Find out the largest child
      if (this._comparer(this._items[left] as T, this._items[right] as T) > 0) {
        largest = left;
      } else {
        largest = right;
      }

      // If Parent is smaller than greatest child, then swap
      if (this._comparer(this._items[index] as T, this._items[largest] as T) < 0) {
        swap(this._items, index, largest);
      }
    }

    this.siftDown(largest);
  }

  protected siftUp(index: number): void {
    if (index < 1) {
      return;
    }

    let parent = this.parent(index);
    while (
      index > 0 &&
      this._comparer(this._items[index] as T, this._items[parent] as T) > 0
    ) {
      swap(this._items as T[], parent, index);
      index = parent;
      parent = this.parent(index);
    }
  }
}

export { MaxBinaryHeap };
export default MaxBinaryHeap;
