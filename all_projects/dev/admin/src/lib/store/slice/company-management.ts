import { createSlice } from '@reduxjs/toolkit';
import {
  ListCompanyCreateWithoutListInput,
  GetCompanyMngtList_getFilteredCompaniesAdmin,
} from 'generatedTypes';

interface CompanyManagementState {
  selectedCompanies: Array<string>;
  existingCompanies: Array<number | string>;
  deletedCompanies: Array<string>;
  selectedCompanyList: GetCompanyMngtList_getFilteredCompaniesAdmin[];
  companyListCount: number;
}

const initialState: CompanyManagementState = {
  selectedCompanies: [],
  existingCompanies: [],
  selectedCompanyList: [],
  deletedCompanies: [],
  companyListCount: 0
};

export const companyManagement = createSlice({
  name: 'companyManagement',
  initialState,
  reducers: {
    updateDeleteCompanies: (state, { payload }: { payload: Array<string> }) => {
      state.deletedCompanies = payload;
    },
    updateSelectedCompanies: (state, { payload }: { payload: Array<string> }) => {
      state.selectedCompanies = payload;
    },
    resetSelectedCompanies: (state) => {
      state.selectedCompanies = [];
      state.deletedCompanies = [];
    },
    countSelectedCompanies: (state, { payload } : { payload: number }) => {
      state.companyListCount = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const companyManagementActions = companyManagement.actions;

export default companyManagement.reducer;

export function getCompanyIds(users: ListCompanyCreateWithoutListInput[]) {
  return users.map((u) => u.company.connect?.id);
}
