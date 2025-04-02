import { createSlice } from '@reduxjs/toolkit';
import { PretaaGetData_pretaaGetSalesStages } from 'generatedTypes';
import { salesStageColors } from 'lib/constant/chartColor';


export interface SalesStage extends PretaaGetData_pretaaGetSalesStages {
  color: string;
}

export const dataSource = createSlice({
  name: 'dataSource',
  initialState: {
    dateRange: [] as { label: string; value: string }[],
    salesStage: [] as SalesStage[],
  },
  reducers: {
    setDateRange: (state, { payload }: any) => {
      state.dateRange = Object.keys(payload).map((range) => ({
        label: payload[range],
        value: range,
      }));
    },
    setSalesStage: (state, { payload }: { payload: PretaaGetData_pretaaGetSalesStages[] }) => {
      state.salesStage = payload.map((s, index) => {
        return {
          ...s,
          color: salesStageColors[index] as string
        };
      });
    },
  },
});

// Action creators are generated for each case reducer function
export const dataSourceActions = dataSource.actions;

export default dataSource.reducer;
