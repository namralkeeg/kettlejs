import Stack from "../../src/collections/Stack";

test("Pop", () => {
  const stack = new Stack<number>();

  expect(stack.pop()).toEqual(null);

  stack.push(1);
  stack.push(2);
  stack.push(3);
  stack.push(4);
  stack.push(5);
  expect(stack.pop()).toEqual(5);
  expect(stack.pop()).toEqual(4);
  expect(stack.pop()).toEqual(3);
  expect(stack.pop()).toEqual(2);
  expect(stack.pop()).toEqual(1);
});

test("Pushes and Pops", () => {
  const stack = new Stack<number>();

  stack.push(1);
  expect(stack.pop()).toEqual(1);
  stack.push(2);
  expect(stack.pop()).toEqual(2);
  stack.push(3);
  expect(stack.pop()).toEqual(3);
  expect(stack.pop()).toEqual(null);
});

test("Peeks", () => {
  const stack = new Stack<number>();

  stack.push(1);
  stack.push(2);
  stack.push(3);
  expect(stack.peek()).toEqual(3);
  stack.pop();
  expect(stack.peek()).toEqual(2);
  stack.pop();
  expect(stack.peek()).toEqual(1);
  stack.pop();
  expect(stack.peek()).toEqual(null);
});

test("Pushes and peeks", () => {
  const stack = new Stack<number>();

  expect(stack.peek()).toEqual(null);
  stack.push(1);
  expect(stack.peek()).toEqual(1);
  stack.push(2);
  expect(stack.peek()).toEqual(2);
  stack.push(3);
  expect(stack.peek()).toEqual(3);
});

test("Correct Count", () => {
  const stack = new Stack<number>();

  expect(stack.count).toEqual(0);

  stack.push(1);
  stack.push(2);
  stack.push(3);
  stack.push(4);
  stack.push(5);
  expect(stack.count).toEqual(5);

  stack.peek();
  expect(stack.count).toEqual(5);

  stack.pop();
  stack.pop();
  stack.pop();
  stack.pop();
  stack.pop();
  expect(stack.count).toEqual(0);
});

test("Contains", () => {
  const stack = new Stack<number>();
  for (let i = 0; i < 100; i++) {
    stack.push(i);
  }

  expect(stack.contains(97)).toEqual(true);
  expect(stack.contains(101)).toEqual(false);
  expect(stack.contains(5)).toEqual(true);
});

test("Iteration Order", () => {
  const stack = new Stack<number>();
  for (let i = 0; i < 10; i++) {
    stack.push(i);
  }

  let i = stack.count - 1;
  for (const item of stack) {
    expect(item).toEqual(i--);
  }
});

test("forEach check", () => {
  const stack = new Stack<number>();
  stack.push(1);
  stack.push(2);
  stack.push(3);

  stack.forEach((x) => x * 2);
  expect(stack.pop()).toEqual(6);
  expect(stack.pop()).toEqual(4);
  expect(stack.pop()).toEqual(2);
});
