
import { createSlice } from '@reduxjs/toolkit';
import { CampaignSlice } from 'interface/campagin.slice.interface';

const initialState: CampaignSlice = {
  campaignName: null,
};

export const campaignSlice = createSlice({
  name: 'campaign',
  initialState: initialState,
  reducers: {
    setCampaignName: (state, { payload }: { payload: string | null } ) => {
      state.campaignName = payload;
    }
  },
});

export const campaignSliceActions = campaignSlice.actions;
export default campaignSlice.reducer;
