import { AppData, GetAllCareTeamType_pretaaHealthGetAllCareTeamType, ReportingDateFilter } from 'health-generatedTypes';
import { AppEvents } from './app.events';
import { SelectBox } from './SelectBox.interface';
import { AssessmentPatientListInterface } from 'screens/Report/AssessmentReport/customHooks/useAssessmentReport';
export interface SideNavBarSelectedFacilityUserInterface {
  facilityAdminId: string;
}

export interface AssessmentSelectedDayMonthInterface {
  dayMonth: SelectBox | null;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
}

export interface SentToPatientSelectedRows {
  id: string;
  userId?:string;
  firstName: string;
  lastName: string;
  email?: string;
  gridRowId?: string;
}

export interface Clinician {
  id: string;
  name: string;
}
export interface StoreClinicianFilterInterface {
  filterMonthNDate: {
    label: string,
    value: ReportingDateFilter
  },
  filterClinicianType: SelectBox | null,
  filterClinicianList: Clinician[],
  clinicianListAll?: boolean,
  rangeStartDate: null | string;
  rangeEndDate: null | string;
}
export interface AssessmentSelectedPatients {
  list: AssessmentPatientListInterface[],
  all: boolean
}


export interface AssessmentFilterInterface {
  selectedDayMonth: AssessmentSelectedDayMonthInterface | null,
  selectedPatients: AssessmentSelectedPatients,
  selectedDischargeStatusTypes: SelectBox | null
}

export interface AppSlice {
  isPatient: boolean | null;
  isSupporter: boolean | null;
  loading: boolean;
  redirectUrl: string | null;
  appData: null | AppData;
  sideNavBarSelectedFacilityUser: SideNavBarSelectedFacilityUserInterface | null;
  appEvents: AppEvents | null;
  sentToPatient: {
    allPatientRows: SentToPatientSelectedRows[] | null;
    selectedRows: SentToPatientSelectedRows[] | null;
    selectedPatientRow: SentToPatientSelectedRows[] | null;
  }
  clinicianFilter: StoreClinicianFilterInterface,
  assessmentFilter: AssessmentFilterInterface,
  assessmentHeader: string | null;
  careTeamTypesLabel: {
    remoteData: GetAllCareTeamType_pretaaHealthGetAllCareTeamType[],
    formattedData: { [key:string]: GetAllCareTeamType_pretaaHealthGetAllCareTeamType }
  }
}
