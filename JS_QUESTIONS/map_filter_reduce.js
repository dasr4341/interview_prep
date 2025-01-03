Array.prototype.myMap = function (cb) {
    const temp = [];
    for (let index = 0; index < this.length; index++) {
        temp.push(cb(this[index], index, this));
    }
    return temp
}
Array.prototype.myFilter = function (cb) {
    const temp = [];
    for (let index = 0; index < this.length; index++) {
        cb(this[index], index, this) && temp.push(this[index]);
       
    }
    return temp
}
Array.prototype.myReduce = function (cb, initialValue) {
    let a = initialValue
    
    for (let index = 0; index < this.length; index++) {
        a = a ? cb(a, this[index], index, this) : this[0]
    }
    return a
}


const num = [1, 2, 3]
const x = num.myReduce((a, c, i) => {
    return a + c
}, 0)

console.log(x, num);
