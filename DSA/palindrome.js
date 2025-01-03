// Question 1 Palindrome Number
// Input - x = 121, Output : true
// x = 10,  Output : false

const x = 122;
const str = x.toString();
const len = (str).length
let i = 0;
let j = len - 1;
while (i <= j) {
    const ch1 = str.charAt(i)
    const ch2 = str.charAt(j)
    if (ch2 !== ch1) {
        console.log('Not a palindrome')
        return;
    }

    i++;
    j--;
}

console.log('palindrome')

