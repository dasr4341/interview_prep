import { createSlice } from '@reduxjs/toolkit';

export interface HelperSlice {
  redirectUrl: string | null;
  toastMessage: {
    message: string | null;
    success: boolean;
  };
}

const initialState: HelperSlice = {
  redirectUrl: null,
  toastMessage: {
    message: null,
    success: false,
  },
};

export const helperSlice = createSlice({
  name: 'helper',
  initialState,
  reducers: {
    setRedirectUrl: (state, { payload }: { payload: string | null }) => {
      state.redirectUrl = payload;
    },
    setToastMessage: (state, { payload }: { payload: { message: string | null; success: boolean } }) => {
      state.toastMessage = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const helperSliceActions = helperSlice.actions;

export default helperSlice.reducer;

