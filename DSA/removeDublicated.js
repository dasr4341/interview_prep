// remove duplicates
// arr = [1, 1, 2, 2, 2, 2, 3, ,3, 3, 4, 4, 4];
// output [1, 2, 3, 4, _, _, _, _, _, _, _, _]

arr = [1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4];
// [1, 2, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];
// [1, 2, 3, 2, 2, 2, 1, 3, 3, 4, 4, 4];

function removeD(arr) {
    let j = 0;
    for (let i = 1; i < arr.length; i++) {
        const e = arr[i];
        
        if (arr[j] !== arr[i]) {
            j++;
            const t = arr[j];
            arr[j] = arr[i];
            arr[i] = t;
        } else {
            arr[i] = "_";
        }
    }
    console.log(arr)
}

removeD(arr)