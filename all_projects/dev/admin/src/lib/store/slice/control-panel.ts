import { createSlice } from '@reduxjs/toolkit';

export interface ControlPanel {
  startSwitching: boolean;
  exportClientId: number | null
}

export const controlPanelSlice = createSlice({
  name: 'control-panel',
  initialState: {
    startSwitching: false,
    exportClientId: null
  } as ControlPanel,
  reducers: {
    updateSwitching: (state, { payload }: { payload :boolean }) => {
      state.startSwitching = payload;
    },
    updateClientId: (state, { payload }: { payload : number | null }) => {
      state.exportClientId = payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const controlPanelActions = controlPanelSlice.actions;

export default controlPanelSlice.reducer;
