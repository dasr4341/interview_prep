// function statement / function declaration 
function x() {
    console.log('function');
}
x()


// function expression
var x = function () {
    console.log('var function');
}
x()


// function are first class citizens
function test(...params) {
    // code
    console.log({arguments});
    
}
const arguments = [1, 2] 
    

test(...arguments)








