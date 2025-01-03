// Question - 5, best time to buy stocks

// input - [7, 1, 5, 3, 6, 4] -> output 5

let min = 0
let max = 0

const arr = [7, 1, 5, 2, 6, 1];

let r = Number.MIN_SAFE_INTEGER

arr.forEach((n, i) => {
    if (n < arr[min]) {
       min = i
    }
    if (n > arr[max]) {
        max = i 
    }
    if (min > max) {
        max = min
    }
});

console.log(arr[max] - arr[min]);
