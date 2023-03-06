const functionTimer = require('./functionTimer');

const arrayAdd = (num) => {
  const list = [];
  for (let i = 0; i < num; i += 1){
    list.push(1);
  }
  return list;
}

for (let i = 0; i <= 7; i += 1) {
  const num = Math.pow(10, i);
  functionTimer(`Adding ${num} items`, () => arrayAdd(num));
}

// const arrayRemoveItemsFromEnd = (list) => {
//   let result = [...list];
//   for (let i = list.length - 1; i < )
// }