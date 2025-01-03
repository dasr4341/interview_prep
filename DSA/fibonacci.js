// Question 2: Fibonacci Number
// print the series

// function print(n) {
//     const arr = [0, 1];
//     let prev1 = arr[0];
//     let prev2 = arr[1];
//     // console.log({ final: prev1, prev1, prev2 })
//     // console.log({ final: prev2, prev1, prev2 })
//     for (let i = 2; i <= n; i++){

//         const final = prev1 + prev2
//         // console.log({ final, prev1, prev2 })
//         arr.push(final)

//         prev1 = prev2;
//         prev2 = final
//     }
//     console.log({ final: arr[n] })
// }
// print(5);
// 0 1 2 3 4
// 0 1 1 2 3

function print(n, arr) {
    if (arr[n]) {
        return arr[n]
    }
    if (n <= 0) {
        const final = 0
        arr[final] = 0
        console.log({ final, n })
        return 0
    }
    if (n === 1) {
        const final = n
        arr[final] = 1
        console.log({ final: 1, n })
        return n
    }

    const prev2 = print(n - 2, arr);
    arr[n - 2] = prev2;
    
    const prev1 = print(n - 1, arr);
    arr[n - 1] = prev1;
    
    const final = prev1 + prev2
    console.log({ final, n })
    return final
}

print(4, [])

// f(4)
// f(3)
// f(2)
// f(1)
// f(0)