import { createSlice } from '@reduxjs/toolkit';
import { BreadCrumb } from 'routes';

export const breadCrumb = createSlice({
  name: 'breadCrumb',
  initialState: {
    value: [] as BreadCrumb[],
  },
  reducers: {
    setLinks: (state, { payload }: { payload : BreadCrumb[] }) => {
      state.value = payload;
    },
    remove: (state) => {
      state.value = [];
    }
  },
});

// Action creators are generated for each case reducer function
export const breadCrumbActions = breadCrumb.actions;

export default breadCrumb.reducer;
