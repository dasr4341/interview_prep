// question - 12

let num = [1, 11, 98, 24, 6, 8, 99];

let max2 = -1
let max = -1

num.forEach((n) => {
    if (max < n) {
        max2 = max;
        max = n;
    }
})

console.log({ max2, max });


