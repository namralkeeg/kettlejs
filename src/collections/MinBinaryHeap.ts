import BinaryHeap from "./BinaryHeap";
import { IComparer } from "../common/interfaces";
import { swap } from "../utils/arrays";

class MinBinaryHeap<T> extends BinaryHeap<T> {
  constructor(capacity?: number, comparer?: IComparer<T>) {
    super(capacity, comparer);
  }

  protected findIndex(item: T): number {
    return this._items.findIndex((x) => this._comparer(x as T, item) == 0);
  }

  protected siftDown(index: number): void {
    const left = this.left(index);
    const right = this.right(index);
    let smallest = 0;

    if (this._count < left) {
      // There's no children. Do nothing.
      return;
    }

    // If there is only a left child of this node
    if (this._count === left) {
      // Do a comparison and swap if the parent is larger.
      if (this._comparer(this._items[index] as T, this._items[left] as T) > 0) {
        swap(this._items, index, left);
      }

      return;
    } else {
      // If both children are there
      // Find out the smallest child
      if (this._comparer(this._items[left] as T, this._items[right] as T) < 0) {
        smallest = left;
      } else {
        smallest = right;
      }

      // If Parent is greater than smallest child, then swap
      if (this._comparer(this._items[index] as T, this._items[smallest] as T) > 0) {
        swap(this._items, index, smallest);
      }
    }

    this.siftDown(smallest);
  }

  protected siftUp(index: number): void {
    if (index < 1) {
      return;
    }

    let parent = this.parent(index);
    while (
      index > 0 &&
      this._comparer(this._items[index] as T, this._items[parent] as T) < 0
    ) {
      swap(this._items as T[], parent, index);
      index = parent;
      parent = this.parent(index);
    }
  }
}

export { MinBinaryHeap };
export default MinBinaryHeap;
