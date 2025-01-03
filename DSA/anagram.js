// question 3
// check isAnagram

// the word is anagram when, the original word , and the rearranged word is same

// car , arc -> true
// circle, circls -> false


function check(str1, str2) {
    if (str1.length !== str2.length) {
        return false
    }

    const obj1 = {}
    const obj2 = {}
    for (let index = 0; index < str1.length; index++) {
        obj1[str1[index]] = 1 + (obj1[str1[index]] || 0)
        obj2[str2[index]] = 1 + (obj2[str2[index]] || 0)
    }

    for (const key in obj1) {
        if (obj1[key] !== obj2[key]) {
            console.log(false)
            return;  
        }
    }
    console.log(true)
}

check("car", "acc");

