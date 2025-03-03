console.log("1. Synchronous log");
setTimeout(() => {
  console.log("5. setTimeout with 0ms");
}, 0);
Promise.resolve().then(() => {
  console.log("3. First Promise then");
});
async function asyncFunc() {
  console.log("2. Inside async function");
  await Promise.resolve();
  console.log("4. After await inside async function");
}
asyncFunc();
console.log("6. After async function call");

