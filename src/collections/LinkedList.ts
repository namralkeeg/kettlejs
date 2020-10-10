import { IReadOnlyCollection, IEqualityComparer, ICollection } from "../common/interfaces";
import { defaultEqualityComparer } from "../utils/helpers";

interface ILinkedListNode<T> {
  next: ILinkedListNode<T> | undefined;
  previous: ILinkedListNode<T> | undefined;
  item: T | undefined;
  list: LinkedList<T> | undefined;
  invalidate(): void;
}

class LinkedListNode<T> implements ILinkedListNode<T> {
  private _next: ILinkedListNode<T> | undefined;
  private _prev: ILinkedListNode<T> | undefined;
  private _item: T | undefined;
  private _list: LinkedList<T> | undefined;

  constructor(
    item?: T,
    list?: LinkedList<T>,
    next?: ILinkedListNode<T>,
    prev?: ILinkedListNode<T>
  ) {
    this._item = item;
    this._list = list;
    this._next = next;
    this._prev = prev;
  }

  get item(): T | undefined {
    return this._item;
  }

  get list(): LinkedList<T> | undefined {
    return this._list;
  }

  get next(): ILinkedListNode<T> | undefined {
    return this._next == undefined || this._next == this._list?.head ? undefined : this._next;
  }

  set next(node: ILinkedListNode<T> | undefined) {
    this._next = node;
  }

  get previous(): ILinkedListNode<T> | undefined {
    return this._prev == undefined || this._prev == this._list?.head ? undefined : this._prev;
  }

  set previous(node: ILinkedListNode<T> | undefined) {
    this._prev = node;
  }

  public invalidate(): void {
    this._next = undefined;
    this._prev = undefined;
    this._item = undefined;
    this._list = undefined;
  }
}

class LinkedList<T> implements IReadOnlyCollection<T>, ICollection<T> {
  private start: ILinkedListNode<T> | undefined = undefined;
  private size = 0;
  private internalComparer: IEqualityComparer<T>;

  constructor(comparer?: IEqualityComparer<T>) {
    this.internalComparer = comparer ?? defaultEqualityComparer;
  }

  private validateNode(node: ILinkedListNode<T>): boolean {
    let status = node ? true : false;

    // The node should be attached to this linked list.
    if (node && node.list !== this) {
      status = false;
    }

    return status;
  }

  private validateNewNode(node: ILinkedListNode<T>): boolean {
    let status = node ? true : false;

    // The node shouldn't be attached to a list yet.
    if (node && node.list != null) {
      status = false;
    }

    return status;
  }

  private insertFirstNodeInternal(newNode: ILinkedListNode<T>): boolean {
    if (!this.start) {
      return false;
    }

    newNode.next = newNode;
    newNode.previous = newNode;
    this.start = newNode;
    this.size++;
    return true;
  }

  private insertNodeBeforeInternal(
    node: ILinkedListNode<T>,
    newNode: ILinkedListNode<T>
  ): void {
    newNode.next = node;
    newNode.previous = node.previous;
    if (node.previous) {
      node.previous.next = newNode;
    }
    node.previous = newNode;
    this.size++;
  }

  private removeNodeInternal(node: ILinkedListNode<T>): boolean {
    if (node.list != this || this.start == undefined) {
      return false;
    }

    if (node.next == this.start) {
      this.start = undefined;
    } else {
      if (node.next) {
        node.next.previous = node.previous;
      }

      if (node.previous) {
        node.previous.next = node.next;
      }

      if (this.start == node) {
        this.start = node.next;
      }
    }

    node.invalidate();

    return true;
  }

  get comparer(): IEqualityComparer<T> {
    return this.internalComparer;
  }

  set comparer(comparer: IEqualityComparer<T>) {
    this.internalComparer = comparer ?? defaultEqualityComparer;
  }

  get count(): number {
    return this.size;
  }

  get head(): ILinkedListNode<T> | undefined {
    return this.start;
  }

  get first(): T | undefined {
    return this.head?.item;
  }

  get last(): T | undefined {
    return this.head?.previous?.item;
  }

  get isReadOnly(): boolean {
    return false;
  }

  public add(item: T): void {
    this.addLast(item);
  }

  [Symbol.iterator](): Iterator<T> {
    const size = this.size;
    let current = this.start;
    let index = 0;

    const iterator = {
      next(): IteratorResult<T> {
        let item: IteratorResult<T>;

        if (index == size || current == undefined) {
          item = { value: undefined, done: true };
        } else {
          item = { value: current.item as T, done: false };
          current = current.next;
          index++;
        }

        return item;
      }
    };

    return iterator;
  }

  public clear(): void {
    let current = this.start;
    while (current != undefined) {
      const temp = current;
      current = current.next;
      temp.invalidate();
    }

    this.start = undefined;
    this.size = 0;
  }

  public remove(item: T): boolean {
    const node = this.find(item);
    if (node != undefined) {
      this.removeNodeInternal(node);
      return true;
    }

    return false;
  }

  public removeFirst(): boolean {
    if (this.start == undefined) {
      return false;
    }

    return this.removeNodeInternal(this.start);
  }

  public removeLast(): boolean {
    if (this.start == undefined) {
      return false;
    }

    if (this.start && this.start.previous) {
      return this.removeNodeInternal(this.start.previous);
    }

    return false;
  }

  public contains(item: T, comparer?: IEqualityComparer<T>): boolean {
    return this.find(item, comparer) != undefined;
  }

  public find(value: T, comparer?: IEqualityComparer<T>): ILinkedListNode<T> | undefined {
    if (!this.start) {
      return undefined;
    }

    const equals = comparer ?? this.internalComparer;
    let node: ILinkedListNode<T> | undefined = this.start;

    if (node) {
      do {
        if (node && equals(value, node.item as T)) {
          return node;
        }
        node = node?.next;
      } while (node !== this.start);
    }

    return undefined;
  }

  public findLast(value: T, comparer?: IEqualityComparer<T>): ILinkedListNode<T> | undefined {
    if (!this.start) {
      return undefined;
    }

    const equals = comparer ?? this.internalComparer;
    const last = this.start.previous;
    let node = last;

    if (node) {
      do {
        if (equals(value, node?.item as T)) {
          return node;
        }
        node = node?.previous;
      } while (node !== last);
    }

    return undefined;
  }

  public toArray(): Array<T> {
    let node = this.start;
    const array = new Array<T>(this.size);

    if (node != undefined) {
      let index = 0;
      do {
        array[index++] = node?.item as T;
        node = node?.next;
      } while (node != this.start);
    }

    return array;
  }

  public addAfter(node: ILinkedListNode<T>, value: T): ILinkedListNode<T> | undefined {
    if (!this.validateNode(node)) {
      return undefined;
    }

    const newNode = new LinkedListNode<T>(value, this);
    this.insertNodeBeforeInternal(node.next as ILinkedListNode<T>, newNode);

    return newNode;
  }

  public addBefore(node: ILinkedListNode<T>, value: T): ILinkedListNode<T> | undefined {
    if (!this.validateNode(node)) {
      return undefined;
    }

    const newNode = new LinkedListNode<T>(value, this);
    this.insertNodeBeforeInternal(node, newNode);

    if (this.start == node) {
      this.start = newNode;
    }

    return newNode;
  }

  public addFirst(value: T): ILinkedListNode<T> {
    const newNode = new LinkedListNode<T>(value, this);

    if (this.start == undefined) {
      this.insertFirstNodeInternal(newNode);
    } else {
      this.insertNodeBeforeInternal(this.start, newNode);
      this.start = newNode;
    }

    return newNode;
  }

  public addLast(value: T): ILinkedListNode<T> {
    const newNode = new LinkedListNode<T>(value, this);

    if (this.start == undefined) {
      this.insertFirstNodeInternal(newNode);
    } else {
      this.insertNodeBeforeInternal(this.start, newNode);
    }

    return newNode;
  }

  public getNodeAt(index: number): ILinkedListNode<T> | undefined {
    if (!index || !this.start || index < 0 || index >= this.size) {
      return undefined;
    }

    if (index == 0) {
      return this.start;
    }

    if (index == this.size - 1) {
      return this.start.previous;
    }

    let current: ILinkedListNode<T> | undefined = this.start;
    let i = -1;
    while (current && ++i <= index) {
      current = current.next;
    }

    return current;
  }

  public getItemAt(index: number): T | undefined {
    return this.getNodeAt(index)?.item;
  }
}

export { LinkedList, LinkedListNode, ILinkedListNode };
export default LinkedList;
