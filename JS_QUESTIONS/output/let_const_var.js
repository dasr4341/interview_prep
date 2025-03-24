// --------------------------------------------------
// 1. scope
// function scope func x(){} - var
// block scope {} - let, const
// {
//   const a = 10;
// }
// console.log(a); // throws err
// --------------------------------------------------
// --------------------------------------------------
// 2. shadowing
// function shadow() {
//   var a = 0;

//   if (true) {
//     var a = 10;
//     console.log("Inside block", a);
//   }
//   console.log("Outside block", a);
// }
// shadow()
// --------------------------------------------------
// --------------------------------------------------

