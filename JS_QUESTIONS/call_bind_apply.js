// const obj = {
//     name: 'sam'
// }
// function o(x) { 
//     console.log(this.name, x);
// }

// // o.call(obj, 33)

// Function.prototype.myCall = function (context = {}, ...args) {
//     context.fn = this;
//     context.fn(...args);
// }
// Function.prototype.myApply = function (context = {}, args) {
//     if (typeof this !== 'function') {
//         throw new Error('Not a function')
//     }
//     if (!Array.isArray(args)) {
//         throw new Error('Not a array')
//     }
//     context.fn = this;
//     context.fn(...args);
// }


// Function.prototype.myBind = function (context, ...args) {
//     if (typeof this !== 'function') throw new Error('Not a callable')
//     context.fn = this;
//     return (...a) => context.fn(...args, ...a);
// }


// const x = o.myBind(obj)
// x(22)



const obj = {
    
}
