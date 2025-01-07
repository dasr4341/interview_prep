// implicit binding
// explicit binding


// function m() {
//     return {
//         name: 'sam',
//         ref: this
//     }
// }
// const obj = {
//     name: 'ram',
//     test: function () {
//         return function () {
//             return {
//                 name: 'sam',
//             ref: this
//            }
//         }();
//     }
// }

// console.log(obj.test());


// implement this -
// calc.add(10).multiply(5).subtract(10).add(10)

const obj = {
    total: 0,
    add(a) {
        this.total += a;
        return this
    },
    multiply(a) {
        this.total *= a;
        return this

    },
    subtract(a) {
        this.total -= a;
        return this

    }
}

console.log(obj.add(10).multiply(5).subtract(10).add(10)
.total);

