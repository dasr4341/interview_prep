// function expression
// const x = function () {

// }
// function () {
//     // anyns func
// }

(function (x) {
  return (function (y) {
    console.log(x);
    //   output -> 1, Closure
  })(2);
})(1);

// function can be used as variables -> first class function
