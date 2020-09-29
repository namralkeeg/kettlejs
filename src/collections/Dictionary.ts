import { IEqualityComparer, IToString } from "./interfaces";
import {
  defaultEqualityComparer,
  hashCode,
  isDefined,
  objectHasProperty
} from "../utils/helpers";

interface IKeyValuePair<K extends IToString, V> {
  key: K;
  value: V;
}

class Dictionary<K extends IToString, V> {
  private internalValueComparer: IEqualityComparer<V>;
  private size: number;
  private table: { [key: number]: IKeyValuePair<K, V> };

  constructor(valueComparer: IEqualityComparer<V> = defaultEqualityComparer) {
    this.internalValueComparer = valueComparer ?? defaultEqualityComparer;
    this.size = 0;
    this.table = {};
  }

  public get comparer(): IEqualityComparer<V> {
    return this.internalValueComparer;
  }

  public set comparer(comparer: IEqualityComparer<V>) {
    this.internalValueComparer = comparer ?? defaultEqualityComparer;
  }

  public get count(): number {
    return this.size;
  }

  public get isEmpty(): boolean {
    return this.size <= 0;
  }

  public get keys(): Array<K> {
    const keys = new Array<K>(this.size);
    let i = 0;
    for (const { key } of Object.values<IKeyValuePair<K, V>>(this.table)) {
      keys[i++] = key;
    }
    return keys;
    // return Object.values<IKeyValuePair<K, V>>(this.table).map(({ key }) => key);
  }

  public get values(): Array<V> {
    const values = new Array<V>(this.size);
    let i = 0;
    for (const { value } of Object.values<IKeyValuePair<K, V>>(this.table)) {
      values[i++] = value;
    }
    return values;
    // return Object.values<IKeyValuePair<K, V>>(this.table).map(({ value }) => value);
  }

  [Symbol.iterator](): Iterator<IKeyValuePair<K, V>> {
    const size = this.size;
    const keys = this.keys;
    const table = this.table;
    let index = 0;

    const iterator = {
      next(): IteratorResult<IKeyValuePair<K, V>> {
        let item: IteratorResult<IKeyValuePair<K, V>>;

        if (index == size) {
          item = { value: undefined, done: true };
        } else {
          const hash = hashCode(keys[index++].toString());
          item = { value: table[hash], done: false };
        }

        return item;
      }
    };

    return iterator;
  }

  public add(key: K, value: V): boolean {
    if (!isDefined(key) || !isDefined(value)) {
      return false;
    }

    const hash = hashCode(key.toString());
    let status = false;
    if (!objectHasProperty(this.table, hash)) {
      this.table[hash] = { key, value };
      status = true;
      this.size++;
    }

    return status;
  }

  public clear(): void {
    this.table = {};
    this.size = 0;
  }

  public containsKey(key: K): boolean {
    if (!isDefined(key)) {
      return false;
    }

    const hash = hashCode(key.toString());
    return objectHasProperty(this.table, hash);
  }

  public containsValue(value: V): boolean {
    for (const { value: dictValue } of Object.values<IKeyValuePair<K, V>>(this.table)) {
      if (this.internalValueComparer(value, dictValue)) {
        return true;
      }
    }

    return false;
  }

  public forEach(callback: (key: K, value: V) => unknown): void {
    for (const { key, value } of Object.values<IKeyValuePair<K, V>>(this.table)) {
      callback(key, value);
    }
  }

  public get(key: K): V | undefined {
    if (!isDefined(key)) {
      return undefined;
    }

    const hash = hashCode(key.toString());
    const value: V | undefined = this.table[hash]?.value;

    return value;
  }

  public remove(key: K): V | undefined {
    if (!isDefined(key)) {
      return undefined;
    }

    const hash = hashCode(key.toString());
    const value: V | undefined = this.table[hash]?.value;
    if (isDefined(value)) {
      delete this.table[hash];
      this.size--;
    }

    return value;
  }

  public set(key: K, value: V): V | undefined {
    if (!isDefined(key) || !isDefined(value)) {
      return undefined;
    }

    const hash = hashCode(key.toString());
    const item: V | undefined = this.table[hash]?.value;
    this.table[hash] = { key, value };

    if (!isDefined(item)) {
      this.size++;
    }

    return item;
  }

  public toString(): string {
    return JSON.stringify(this.table);
  }
}

export { Dictionary };
export default Dictionary;
