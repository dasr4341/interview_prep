import { createSlice } from '@reduxjs/toolkit';

import { CompilationInterface } from 'Interface/Compilation';
import { CompilationListInterface } from 'Interface/CompilationListInterface';
import { CompilationSliceInterface, ProcessReport } from 'Interface/CompilationSlice';

const initialState: CompilationSliceInterface = {
  errorMessage: null,
  successMessage: null,
  compilationList: [],
  loading: false,
  listLoader: true,
  compilationCreating: false,
  report: {
    processingId: null
  }
};

const compilationSlice = createSlice({
  name: 'compilation',
  initialState,
  reducers: {
    // create compilation
    createCompilation: (state, { payload }: { payload: CompilationInterface }) => {
      state.compilationCreating = true;
      console.log({ state, payload });
    },
    updateCompilationFormState: (state, { payload }: { payload: { compilationCreating?: boolean } }) => {
      state.compilationCreating = Boolean(payload.compilationCreating);
    },

    // get list of compilation
    getCompilationList: (state) => {
      state.loading = true;
      console.log({ compilationLength: state.compilationList.length });
    },
    setCompilationList: (state, { payload }: { payload: CompilationListInterface[] }) => {
      state.compilationList = payload;
      state.listLoader = false;
      state.loading = false;
    },

    downloadReport: (state, { payload }: { payload: ProcessReport }) => {
      state.report = payload;
    },
  },
});

export const compilationActions = compilationSlice.actions;
export const compilationReducer = compilationSlice.reducer;
