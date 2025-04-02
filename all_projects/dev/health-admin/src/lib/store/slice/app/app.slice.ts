import { AppData, AssessmentPatientsDischargeFilterTypes, CareTeamTypes, GetAllCareTeamType_pretaaHealthGetAllCareTeamType, ReportingDateFilter } from './../../../../health-generatedTypes';
import { createSlice } from '@reduxjs/toolkit';
import {
  AppSlice,
  AssessmentFilterInterface,
  SentToPatientSelectedRows,
  SideNavBarSelectedFacilityUserInterface,
  StoreClinicianFilterInterface,
} from 'interface/app.slice.interface';
import { AppEvents } from 'interface/app.events';
import { SelectBox } from 'interface/SelectBox.interface';

const initialState: AppSlice = {
  isPatient: null,
  isSupporter: null,
  loading: false,
  redirectUrl: null,
  appData: null,
  sideNavBarSelectedFacilityUser: null,
  appEvents: null,
  sentToPatient: {
    allPatientRows: null,
    selectedRows: null,
    selectedPatientRow: null,
  },
  clinicianFilter: {
    // in case in future SEVEN_DAYS may not be available then ---
    filterMonthNDate: {
      value: ReportingDateFilter?.SEVEN_DAYS || Object.values(ReportingDateFilter)[0],
      label: ''
    },
   
    filterClinicianType: CareTeamTypes?.PRIMARY_THERAPIST ? {
      label: CareTeamTypes.PRIMARY_THERAPIST.replaceAll('_', ' ').toLowerCase(),
      value: CareTeamTypes.PRIMARY_THERAPIST
    } : null,

    filterClinicianList: [],
    clinicianListAll: true,
    
    rangeStartDate: null,
    rangeEndDate: null
  },
  assessmentFilter: {
    selectedDayMonth: null,
    selectedPatients: {
      all: true,
      list: [],
    },
    selectedDischargeStatusTypes: {
      value: AssessmentPatientsDischargeFilterTypes.IN_CENSUS,
      label: AssessmentPatientsDischargeFilterTypes.IN_CENSUS
    }
  },
  assessmentHeader: '0',
  careTeamTypesLabel: {
    remoteData: [],
    formattedData: {}
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState: initialState,
  reducers: {
    setAppLoading: (state, { payload }: { payload: boolean }) => {
      state.loading = payload;
    },
    redirectToPage: (state, { payload }: { payload: string | null }) => {
      state.redirectUrl = payload;
    },
    setAppData: (state, { payload }: { payload: AppData | null }) => {
      state.appData = payload;
    },
    setSideNavBarSelectedFacilityUsers: (state, { payload }: { payload: SideNavBarSelectedFacilityUserInterface | null }) => {
      state.sideNavBarSelectedFacilityUser = payload;
    },
    resetAppState: (state) => {
      state.appData = null;
      state.loading = false;
      state.redirectUrl = null;
      state.sideNavBarSelectedFacilityUser = null;
    },
    setAppEvents: (state, { payload }: { payload: AppEvents | null }) => {
      state.appEvents = payload;
    },
    // Select Patients
    setSelectedPatientRows: (state, { payload }: { payload: SentToPatientSelectedRows[] }) => {
      state.sentToPatient.selectedRows = payload;
    },
    setSelectedPatientList: (state, { payload }: { payload: SentToPatientSelectedRows[] }) => {
      state.sentToPatient.selectedPatientRow = payload;
    },
    setAllPatientRows: (state, { payload }: { payload: SentToPatientSelectedRows[] }) => {
      state.sentToPatient.allPatientRows = payload;
    },
    setClinicianFilter: (state, { payload }: { payload: StoreClinicianFilterInterface }) => {
      state.clinicianFilter = payload;
    },
    setAssessmentFilter: (state, { payload }: { payload: AssessmentFilterInterface }) => {
      state.assessmentFilter = payload;
    },
    setDefaultValuesForDateMonthRangeFilter: (state, { payload }: {
      payload: {
        data: SelectBox,
        defaultFilterFor: 'assessmentFilter' | 'reportFilter' | 'clinicianFilter'
      }
    }) => {
      // assessment report filter -> for counsellor
      if (!state.assessmentFilter.selectedDayMonth?.dayMonth?.label.length && payload.defaultFilterFor === 'assessmentFilter') {
        state.assessmentFilter.selectedDayMonth = {
          dateRange:{ startDate : null, endDate: null }, dayMonth: payload.data
        };
      }
      // report filter -> facility admin
      if (!state.clinicianFilter.filterMonthNDate.label.length && payload.defaultFilterFor === 'clinicianFilter') {
        state.clinicianFilter.filterMonthNDate = payload.data as { label: string;  value: ReportingDateFilter };
      }
    },
    setAssessmentHeader: (state, { payload }: { payload: string }) => {
      state.assessmentHeader = payload;
    },
    setCareTeamTypeLabels: (state, { payload }: {
      payload: {
        remoteData: GetAllCareTeamType_pretaaHealthGetAllCareTeamType[],
        formattedData: { [key:string]: GetAllCareTeamType_pretaaHealthGetAllCareTeamType }
    } }) => {
      state.careTeamTypesLabel = payload;
    },
    setClinicianFilterClinicianType: (state, { payload }: {
      payload: { [key:string]: GetAllCareTeamType_pretaaHealthGetAllCareTeamType }
    }) => {
      const { updatedValue, defaultValue } = payload[state.clinicianFilter.filterClinicianType?.value as string];
      if (state.clinicianFilter.filterClinicianType?.label) {
        state.clinicianFilter.filterClinicianType.label = updatedValue || defaultValue;
      }
    }
  },
});

export const appSliceActions = appSlice.actions;
export default appSlice.reducer;
