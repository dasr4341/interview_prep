export const increaseCounter = (value) => {
    console.log('action is called');
    return {
      type: 'increase',
      data: value,
    };
    // return (appCounter) => {
    //     appCounter({
    //         type: 'increase',
    //         payLoad: value
    //     })
    // }
};
export const decreaseCounter = (value) => {
    console.log('action is called');
    return {
        type: 'decrease',
        data: value
    }
}
export const testCounter =  (value) => {
//     const data = await fetch("https://jsonplaceholder.typicode.com/todos/1");
//     data = await data.json();

  console.log("test action is called ",value);
  return {
    type: "test1",
    data: value,
  };
};


