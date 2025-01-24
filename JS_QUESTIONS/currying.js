// currying is a function which takes one argument at a time and return a new function expecting a new argument, f(a, b) => f(a)(b)
// manipulation dom

// function f(a) {
//     return function (b) {
//         console.log(a, b);
//     }
// }

// f(5)(7);

// sum(4)(5)(5)

// function sum(a) {
//   return function (b) {
//     return function (c) {
//       return a + b + c;
//     };
//   };
// }

// infinite currying
// function sum(a) {
//     return (b) => {
//         if (b) return sum(a + b);
//         return a;
//    }
// }

// const s = sum(9)

// console.log(s(1)(2)());


// // convert a normal function to curried func
const curry = (func) => {
    return function curriedF(...args) {
        if (args.length >= func.length) {
          return func(...args)  
        } else {
          return function (...next) { return curriedF(...args, ...next)}
        }
    }
}
const normal = (a, b, c, d) => a + b + c + d

// const totalSum = curry(normal);
// console.log(totalSum(1)(2)(4)(42)   );
