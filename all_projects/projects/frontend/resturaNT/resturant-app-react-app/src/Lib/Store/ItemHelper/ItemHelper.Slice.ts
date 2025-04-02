import { createSlice } from '@reduxjs/toolkit';

export interface ItemHelperInterface {
    itemId: number,
    leftOver: number,
}

export interface ItemHelperSliceInterface {
  itemHelper: ItemHelperInterface[]
}

const initialState: ItemHelperSliceInterface = { itemHelper : [] } ;

export const ItemHelperSlice = createSlice({
  name: 'ItemHelper',
  initialState,
  reducers: {
    getLeftAllItemsLeftOverQuantity: () => {
      console.log('getting the left over items quantity ....');
    },
    setLeftOverAllItemsLeftOverQuantity: (state, { payload }: { payload : ItemHelperInterface[] }) => {
      state.itemHelper = payload;
    }
  }
});

export const ItemHelperSliceActions = ItemHelperSlice.actions;
export default ItemHelperSlice.reducer;