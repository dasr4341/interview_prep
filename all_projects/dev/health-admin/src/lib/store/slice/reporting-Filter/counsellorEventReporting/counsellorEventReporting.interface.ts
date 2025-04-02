import { EventReportingDateFilterTypes } from 'health-generatedTypes';

export interface FilterUsers {
  patientId: string,
  name: string
}

export interface CounsellorReportingInterface {
  filterMonthNDate: EventReportingDateFilterTypes | null,
  rangeStartDate: null | string;
  rangeEndDate: null | string;
  lastNumber: number | null;
  selectedMenu: string | null;
  selectedSubMenu: string | null;
  filterUsers: FilterUsers[],
  all: boolean
}

export interface CounsellorReportingSliceInterface {
  reportFilter: CounsellorReportingInterface
}