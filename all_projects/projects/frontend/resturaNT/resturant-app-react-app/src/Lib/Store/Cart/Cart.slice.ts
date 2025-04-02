/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice } from '@reduxjs/toolkit';
import { CartSliceInterface, CartItemInterface, CartUserInterface } from '../../Interface/Cart/CartInterface';

export interface CartSlice {
  cart: CartSliceInterface;
}
export interface NoOfItemsPayload { itemId: number; noOfItems: number }

const initialState: CartSlice = {
  cart: {
    user: {
      id: undefined,
      name: undefined,
      phone: undefined
    },
    items: []
  },
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, { payload }: { payload: CartItemInterface }) => {
      const index = state.cart.items.findIndex((element) => element.id === payload.id);
      if (index >= 0) {
        state.cart.items[index].noOfItems += 1;
      } else {
        state.cart.items.push(payload);
      }
    },
    deleteAllItems: (state) => {
      state.cart.items = [];
    },
    deleteItems: (state, { payload }: { payload: { itemId: number } }) => {
      const index = state.cart.items.findIndex((element) => element.id === payload.itemId);
      if (index === 0) {
        state.cart.items.shift();
      } else {
        state.cart.items.splice(index, index);
      }
    },
    setNoOfItems: (state, { payload }: { payload: NoOfItemsPayload }) => {
      const editedItems = state.cart.items.map((element) => {
        if (payload.itemId === element.id) {
          element.noOfItems = payload.noOfItems;
        }
        return element;
      });
      state.cart.items = editedItems;
    },
    placeOrder: (state, action) => {
      console.log('place order initiate');
    },
    setUser: (state, { payload }: { payload: CartUserInterface }) => {
      state.cart.user = payload;
    }
  },
});

export const cartSliceActions = cartSlice.actions;
export default cartSlice.reducer;
