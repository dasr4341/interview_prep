// this file will store the function definition, helper

function setScrollVar() {
    const htmlElement = document.documentElement;
    const percentOfScrollFromTop =( htmlElement.scrollTop / htmlElement.clientHeight ) * 100;
    htmlElement.style.setProperty('--scroll', Math.min(percentOfScrollFromTop, 100));
}
