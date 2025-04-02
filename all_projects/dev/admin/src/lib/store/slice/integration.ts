import { createSlice } from '@reduxjs/toolkit';

interface IntegrationState {
  selectedIntegration: any;
}

const initialState: IntegrationState = {
  selectedIntegration: {},
};

export const Integration = createSlice({
  name: 'integration',
  initialState,
  reducers: {
    addSelectedIntegration: (state, { payload }: { payload: any }) => {
      state.selectedIntegration = payload;
    },
    resetSelectedIntegration: (state) => {
      state.selectedIntegration = {};
    },
  },
});

// Action creators are generated for each case reducer function
export const integrationActions = Integration.actions;

export default Integration.reducer;
