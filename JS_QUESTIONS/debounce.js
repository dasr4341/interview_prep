function debounce(cb = {}, delay = 100) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

const timer = debounce((value) => {
    console.log(value)
}, 100)

const numbers = [...Array(10).keys()].forEach(e => {
    setTimeout(() => {
        timer(e)
        timer(e)
        timer(e)
        timer(e)
        timer(e)
        timer(e)
    }, e * 1000)
})
