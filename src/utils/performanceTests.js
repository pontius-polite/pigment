const functionTimer = require('./functionTimer');

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const arrayAdd = (num) => {
  const list = [];
  for (let i = 0; i < num; i += 1){
    list.push(1);
  }
  return list;
}

let table = [];
for (let i = 0; i <= 7; i += 1) {
  const num = Math.pow(10, i);
  const time = functionTimer(() => arrayAdd(num));
  table.push({items: num, time: time});
}
console.log('Adding items with push():');
console.table(table);

const arrayRemoveFromEnd = (list) => {
  let result = [...list];
  for (let i = list.length - 1; i >= 0; i -= 1 ) {
    result.pop();
  }
}

table = [];
for (let i = 0; i <= 7; i += 1) {
  const num = Math.pow(10, i);
  const list = arrayAdd(num);
  const time = functionTimer(() => arrayRemoveFromEnd(list));
  table.push({items: num, time: time});
}
console.log('Removing array items with pop():');
console.table(table);

const arrayRemoveFromStart = (list) => {
  let result = [...list];
  for (let i = list.length - 1; i >= 0; i -= 1 ) {
    result.splice(1);
  }
}

table = [];
for (let i = 0; i <= 7; i += 1) {
  const num = Math.pow(10, i);
  const list = arrayAdd(num);
  const time = functionTimer(() => arrayRemoveFromStart(list));
  table.push({items: num, time: time});
}
console.log('Removing array items with splice():');
console.table(table);

const linkedListAdd = (num) => {
  const start = new Node(1);
  let current = start;
  for (let i = 0; i < num; i += 1){
    current.next = new Node(1);
    current = current.next;
  }
  return start;
}

table = [];
for (let i = 0; i <= 7; i += 1) {
  const num = Math.pow(10, i);
  const time = functionTimer(() => linkedListAdd(num));
  table.push({items: num, time: time});
}
console.log('Adding items to linked list:');
console.table(table);

const linkedListRemove = (start) => {
  while (start !== null) {
    start = start.next;
  }
}

table = [];
for (let i = 0; i <= 7; i += 1) {
  const num = Math.pow(10, i);
  const start = linkedListAdd(num);
  const time = functionTimer(() => linkedListRemove(start));
  table.push({items: num, time: time});
}
console.log('Removing items from linked list:');
console.table(table);