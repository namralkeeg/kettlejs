import Dictionary from "../../src/collections/Dictionary";
import { IToString } from "../../src/common/interfaces";

describe("Dictionary", () => {
  // let dict: Dictionary<string, number>;
  let dict: Dictionary<IToString, unknown>;
  const elements = 103;
  const elementKeys: string[] = [];

  beforeAll(() => {
    // dict = new Dictionary();

    for (let i = 0; i < elements - 3; i++) {
      elementKeys.push(i.toString());
    }

    // Problematic keys
    elementKeys.push("hasOwnProperty"); // 100
    elementKeys.push("__proto__"); // 101
    elementKeys.push(""); // 102
  });

  beforeEach(() => {
    dict = new Dictionary();
  });

  test("Maps keys to values with string keys", () => {
    expect(dict.get("sd")).toEqual(undefined);

    // test with string keys
    for (let i = 0; i < elements; i++) {
      expect(dict.set(elementKeys[i], i + 1)).toEqual(undefined);
    }
    expect(dict.count).toEqual(elements);

    for (let i = 0; i < elements; i++) {
      expect(dict.get(elementKeys[i])).toEqual(i + 1);
    }

    dict.set("a", 5);
    expect(dict.get("a")).toEqual(5);
    expect(dict.set("a", 21)).toEqual(5);
    expect(dict.get("a")).toEqual(21);
    expect(dict.count).toEqual(elements + 1);
  });

  test("Maps keys to values with number keys", () => {
    for (let i = 0; i < elements; i++) {
      expect(dict.set(i, i + 1)).toEqual(undefined);
    }

    expect(dict.count).toEqual(elements);

    for (let i = 0; i < elements; i++) {
      expect(dict.get(i)).toEqual(i + 1);
    }
  });

  test("Remove existing elements.", () => {
    expect(dict.remove("1")).toEqual(undefined);
    for (let i = 0; i < elements; i++) {
      expect(dict.set(elementKeys[i], i + 1)).toEqual(undefined);
    }
    expect(dict.count).toEqual(elements);

    for (let i = 0; i < elements; i++) {
      expect(dict.remove(elementKeys[i])).toEqual(i + 1);
      expect(dict.get(elementKeys[i])).toEqual(undefined);
      expect(dict.remove(elementKeys[i])).toEqual(undefined);
    }
    expect(dict.count).toEqual(0);
  });

  test("Empty dictionary is empty.", () => {
    expect(dict.isEmpty).toEqual(true);
    dict.set("1", 1);
    expect(dict.isEmpty).toEqual(false);
    dict.remove("1");
    expect(dict.isEmpty).toEqual(true);
  });

  test("Clear empties the dictionary", () => {
    dict.clear();
    expect(dict.isEmpty).toEqual(true);
    expect(dict.count).toEqual(0);
    dict.set(1, 1);
    dict.clear();
    expect(dict.isEmpty).toEqual(true);
    expect(dict.count).toEqual(0);
    expect(dict.get(1)).toEqual(undefined);
  });

  test("Contains keys", () => {
    expect(dict.containsKey(0)).toEqual(false);
    for (let i = 0; i < 10; i++) {
      dict.set(elementKeys[i], i);
      expect(dict.containsKey(elementKeys[i])).toEqual(true);
    }
    for (let i = 0; i < 10; i++) {
      dict.remove(elementKeys[i]);
      expect(dict.containsKey(elementKeys[i])).toEqual(false);
    }
  });

  test("Contains values", () => {
    expect(dict.containsValue(0)).toEqual(false);
    for (let i = 0; i < 10; i++) {
      dict.set(elementKeys[i], i);
      expect(dict.containsValue(i)).toEqual(true);
    }
    for (let i = 0; i < 10; i++) {
      dict.remove(elementKeys[i]);
      expect(dict.containsValue(i)).toEqual(false);
    }
  });

  test("Gives the correct count", () => {
    expect(dict.count).toEqual(0);
    for (let i = 0; i < 10; i++) {
      dict.set(elementKeys[i], i);
      expect(dict.count).toEqual(i + 1);
    }
  });

  test("Gives all existing keys", () => {
    for (let i = 0; i < elements; i++) {
      dict.add(elementKeys[i], i);
    }

    const keys = dict.keys.sort();
    const keyItems = elementKeys.slice().sort();
    for (let i = 0; i < elements; i++) {
      expect(keys[i] == keyItems[i]).toEqual(true);
    }
  });

  test("Gives all existing values", () => {
    const valueItems: number[] = [];
    for (let i = 0; i < elements; i++) {
      dict.add(elementKeys[i], i);
      valueItems.push(i);
    }

    const values = dict.values.sort();
    valueItems.sort();
    for (let i = 0; i < elements; i++) {
      expect(values[i] == valueItems[i]).toEqual(true);
    }
  });

  test("forEach iterates over all the key/value pairs", () => {
    for (let i = 0; i < elements; i++) {
      dict.add(elementKeys[i], i + 1);
    }

    const keys = dict.keys;
    const values = dict.values;
    dict.forEach((key, value) => {
      expect(keys.find((k) => key == k) != undefined).toEqual(true);
      expect(values.find((v) => value == v) != undefined).toEqual(true);
    });
  });
});
