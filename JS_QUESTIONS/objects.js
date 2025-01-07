// 

const obj = { b: 3, a: 1, c: 2 };

console.log(Object.entries(obj)
    .sort(([_, a], [, b]) => {
        return a - b;
    }).reduce((a, [key, value ]) => {
        a[key] = value;
        return a;
}, {}))