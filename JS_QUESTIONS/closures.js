// function createBase(n) {
//     let base = n;
//     return (x=0) => {
//         console.log(base + x);
//     }
// }

// const add = createBase(6);
// add(10)
// add(21)

// function Counter(c = 0) {
//     this.c = c
//     this.add = () => {
//         c++;
//     }
//     this.red = () => {
//         c--;
//     }
//     this.getCount = function () {
//         return c;
//     }
// }

// const counter = new Counter();
// counter.add()
// counter.add()
// counter.add()
// counter.add()
// counter.add()
// counter.add()
// counter.add()
// console.log(counter.getCount())

// module pattern
// const Module = (function () {
//     function private() {

//     }
//     return {
//         public() {
//             console.log('hey');

//         }
//     }
// })();

// Module.public()

// make it run once
// function Once() {
//     let count = 0;
//     return () => {
//         if (!count) {
//             count++;
//             console.log('heloo')
//         }
//     }
// }
// const check = Once();
// check()
// check()
// check()
// check()
// check()

// polyfill for once
// function once(func, context) {
//     let c = 0;
//     return () => {
//         // console.log(c)
//         // c++;
//         if (func) {
//             func();
//             func = null;
//         }
//     }
// }

// const check = once(() => {
//     console.log('hey')
// })

// check()
// check()
// check()
// check()
// check()
// check()
