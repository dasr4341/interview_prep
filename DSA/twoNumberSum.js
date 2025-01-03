// question 4
// target : 9
// - given arr = [2, 4, 5, 6, 7];
// - output -> [1, 2]

const obj = {};
const target = 9;

[2, 4, 5, 6, 7].forEach((e, i) => {
    const r = target - e;
    if (obj[r] >= 0) {
        console.log([r, e]);
    } 
    obj[e] = i
})


