// Question - 5, best time to buy stocks

// input - [7, 1, 5, 3, 6, 4] -> output 5

let min = 0;
let max = 0;
let maxR = -1;
const obj = {};

const arr = [7, 1, 5, 2, 6, -1, 9];
const len = arr.length;

arr.forEach((n, i) => {
  if (n < arr[min] && n >= 0 && i !== len - 1) {
    min = i;
  }
  if (n > arr[max]) {
    max = i;
  }
  if (min > max) {
    max = min;
  }
  const res = arr[max] - arr[min];
  if (maxR < res) {
      maxR = res;
      obj['max'] = max
      obj['min'] = min
  }
});

console.log(arr[obj.max] - arr[obj.min], obj);
