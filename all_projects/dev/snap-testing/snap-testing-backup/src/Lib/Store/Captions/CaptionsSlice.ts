import { createSlice } from '@reduxjs/toolkit';

import { CaptionsSliceInterface } from 'Interface/CaptionsSlice';
import { CaptionsInterface } from 'Interface/Captions';

const initialState: CaptionsSliceInterface = {
  errorMessage: null,
  captions: [],
};

const captionsSlice = createSlice({
  name: 'captions',
  initialState,
  reducers: {
    getCaptions: (state) => {
      console.log({ captionsLength: state.captions.length });
    },
    setCaptionsError: (state, { payload }: { payload: string }) => {
      state.errorMessage = payload;
    },
    setCaptions: (state, { payload }: { payload: CaptionsInterface[] }) => {
      state.captions = payload;
    },
  },
});

export const captionsActions = captionsSlice.actions;
export const captionsReducer = captionsSlice.reducer;
