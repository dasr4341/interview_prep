

const arr = [1, 2, 3, 4, 5];
// arr.map((e) => console.log(e));

Array.prototype.myMap = function (cb) {
    const temp = []
    for (let i = 0; i < this.length; i++){
        temp.push(cb(this[i], i, this))
    }

    return temp
}
Array.prototype.myFilter = function (cb) {
    const temp = []
    for (let i = 0; i < this.length; i++){
        if(cb(this[i], i, this) )
        {
            temp.push(this[i])
            }
    }
    return temp
}
Array.prototype.myReduce = function (cb, initValue = this[0]) {
    let temp = initValue 

    for (let i = 0; i < this.length; i++){
        temp = (cb(temp, this[i], i, this))
    }
    return temp
}

const updatedArr = arr.myMap((e) => {
    return e + 1
})
const filteredArr = arr.myFilter((e) => e % 2 === 0)
const reducedArr = arr.myReduce((e, c) => e + c, 0)

console.log({ reducedArr, updatedArr, filteredArr });