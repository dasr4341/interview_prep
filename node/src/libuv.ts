console.log('Start');

setTimeout(() => console.log('setTimeout  1'), 0)
process.nextTick(() => {
  console.log('Next Tick 1');
});

Promise.resolve().then(() => {
  console.log('Promise 1');
  setTimeout(() => console.log('setTimeout  2'), 10)
});

process.nextTick(() => {
  console.log('Next Tick 2');
  
});

Promise.resolve().then(() => {
  console.log('Promise 2');
});

console.log('End');


// what - it is a cross platform open source library written in c++
// why - it handles all async non-blocking task of node js
// how - Thread pool, Event loop

// process.env.UV_THREADPOOL_SIZE = '5'

// handle the async method in 2 diff ways 
// 1. Native async mechanism -> network i/o task
// 2. thread pool -> cpu intensive task



