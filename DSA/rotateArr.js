// rotate an array

const arr = [1, 2, 3, 4, 5, 6, 7];
function rev(arr, i, j) {
    while (i <= j) {
        const t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;

        i++;
        j--;
    }

}

function rotate(i, arr) {
    const start = 0;
    const end = arr.length - 1;
    rev(arr, start, i - 1)
    rev(arr, i, end)
    rev(arr, start, end)
    console.log(arr);
}

rotate(0, arr);
