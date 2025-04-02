import { format, subDays } from 'date-fns';
import { CounsellorReportingInterface, CounsellorReportingSliceInterface } from './counsellorEventReporting.interface';
import { config } from 'config';
import { createSlice } from '@reduxjs/toolkit';
import { SelectBox } from 'interface/SelectBox.interface';
import { EventReportingDateFilterTypes } from 'health-generatedTypes';



const initialState: CounsellorReportingSliceInterface = {
  reportFilter: {
    filterMonthNDate: EventReportingDateFilterTypes.CUSTOM_RANGE,
    rangeStartDate: format(subDays(new Date(), 7), config.dateFormat),
    rangeEndDate: format(new Date(), config.dateFormat),
    lastNumber: null,
    selectedMenu: null,
    selectedSubMenu: null,
    filterUsers: [],
    all: true,
  }
};

export const counsellorReportingSlice = createSlice({
  name: 'counsellorReporting',
  initialState,
  reducers: {
    setReportFilter: (state, { payload }: { payload: CounsellorReportingInterface }) => {
      state.reportFilter = payload;
    },
    setDefaultValuesForDateMonthRangeFilter: (state, { payload }: {
      payload: {
        data: SelectBox,
      }
    }) => { 
    if (!state.reportFilter.filterMonthNDate) {
      state.reportFilter.filterMonthNDate = payload.data.value as EventReportingDateFilterTypes;
    }
  } 
  }
});

export const counsellorReportingSliceActions = counsellorReportingSlice.actions;
export default counsellorReportingSlice.reducer;