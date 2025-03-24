// 1. what will these print ? 

// let count = 0;
// (function test() {
//     if (count === 0) {
//         let count = -1
//         console.log(count);
//     }
//     console.log(count);
// })();

// ans- 
// -1
// 0

// --------------------------------------------------
// --------------------------------------------------

// 2. Write a function that allow you to do this 

// const addSix = createBase(10);
// addSix(30) // 46
// addSix(10) // 56

// ans - 
// function createBase(baseVal = 0) {
//     return (val = 0) => {
//         return val + baseVal;
//     }
// }

// const addSix = createBase(10);
// console.log(addSix(30));
// console.log(addSix(10));

// --------------------------------------------------
// --------------------------------------------------

// 3. Time optimization
// function find() {
//     const a = []
//     for (let i = 0; i < 1000000; i++) {
//         a[i]  = Math.random(i)
//     }
//     return (index) => {
//         a[index]
//     }
// }
// const findIndex = find();

// console.time('40')
// findIndex(40)
// console.timeEnd('40')
// console.time('3')
// findIndex(3)
// console.timeEnd('3')

// --------------------------------------------------
// --------------------------------------------------

// 4. Block scope and setTimeout
// function outer() {
//     for (var i = 0; i < 3; i++) {
//         function inner(n) {
//             setTimeout(() => {
//                 console.log(n);
//             }, n * 100)
//         }
//         inner(i)
//     }
// }
// outer()

// continue from here
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
};

const p = new Person();
p.greet()








