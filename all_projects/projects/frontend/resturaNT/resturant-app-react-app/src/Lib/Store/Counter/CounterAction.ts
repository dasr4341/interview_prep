export const counterSliceAction = {
  increment: 'counter/increment',
  decrement: 'counter/decrement',
  incrementByAmount: 'counter/incrementByAmount',
  incrementByAmountAction: (payload: number) => ({ type: counterSliceAction.incrementByAmount,  payload })
};
