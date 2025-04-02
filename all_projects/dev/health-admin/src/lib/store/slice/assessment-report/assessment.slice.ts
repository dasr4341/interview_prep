
import { createSlice } from '@reduxjs/toolkit';
import { AssessmentReportSlice, SelectedCampaign } from './report.slice.interface';

const initialState: AssessmentReportSlice = {
  selectedCampaign: null,
};

export const assessmentReportSlice = createSlice({
  name: 'assessment-report',
  initialState: initialState,
  reducers: {
    setSelectedCampaign: (state, { payload }: { payload: SelectedCampaign | null }) => {
      state.selectedCampaign = payload;
    },
  },
});

export const reportSliceActions = assessmentReportSlice.actions;
export default assessmentReportSlice.reducer;
