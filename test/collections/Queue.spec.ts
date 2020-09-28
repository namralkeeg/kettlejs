import Queue from "../../src/collections/Queue";

const defaultQueue = (): Queue<string> => new Queue<string>(3);

const populateQueue = (queue: Queue<string>): void => {
  queue.enqueue("a");
  queue.enqueue("b");
  queue.enqueue("c");
};

test("Correct Count", () => {
  const queue = defaultQueue();
  expect(queue.count).toEqual(0);

  populateQueue(queue);
  expect(queue.count).toEqual(3);

  queue.enqueue("d");
  expect(queue.count).toEqual(4);

  queue.dequeue();
  expect(queue.count).toEqual(3);

  queue.clear();
  expect(queue.count).toEqual(0);
});

test("Enqueus and Dequeues", () => {
  const queue = defaultQueue();
  populateQueue(queue);

  let head: string | undefined = queue.dequeue();
  expect(head).toEqual("a");

  queue.dequeue();
  head = queue.dequeue();
  expect(head).toEqual("c");

  head = queue.dequeue();
  expect(head).toEqual(undefined);
});

test("Is Empty", () => {
  const queue = defaultQueue();
  expect(queue.isEmpty).toEqual(true);
});

test("Peeks", () => {
  const queue = defaultQueue();
  populateQueue(queue);

  let head = queue.peek();
  expect(head).toEqual("a");
  let dequeue = queue.dequeue();
  expect(dequeue).toEqual(head);

  head = queue.peek();
  expect(head).toEqual("b");
  dequeue = queue.dequeue();
  expect(head).toEqual(dequeue);

  queue.clear();
  head = queue.peek();
  expect(head).toEqual(undefined);
});

test("Contains", () => {
  const queue = defaultQueue();
  populateQueue(queue);
  expect(queue.contains("a")).toEqual(true);
  expect(queue.contains("b")).toEqual(true);
  expect(queue.contains("c")).toEqual(true);
  expect(queue.contains("z")).toEqual(false);
  queue.dequeue();
  expect(queue.contains("a")).toEqual(false);
});

test("forEach gives the correct order.", () => {
  const queue = new Queue<number>(10);

  queue.forEach(() => {
    expect(true).toEqual(false); // Should never get here.
  });

  for (let i = 0; i < 10; i++) {
    queue.enqueue(i);
  }

  let i = 0;
  queue.forEach((e) => {
    expect(e).toEqual(i++);
  });
});
