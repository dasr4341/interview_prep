function throttle(cb = {}, delay = 100) {
    let shouldWait = false;
    let waitingArgs = null;
    const t = () => {
        if (waitingArgs === null) {
            shouldWait = false
        } else {
            cb(...waitingArgs);
            waitingArgs = null
            setTimeout(t, delay)
        }
    };
    return (...args) => {
        if (shouldWait) {
            waitingArgs = args;
            return;
        }
        cb(...args);
        shouldWait = true;

        setTimeout(t, delay)
    }
}

const timer = throttle((value) => {
    console.log(value);
}, 300)

document.getElementById('throttle_input').addEventListener('input', (e) => {
    timer(e.target.value)
})