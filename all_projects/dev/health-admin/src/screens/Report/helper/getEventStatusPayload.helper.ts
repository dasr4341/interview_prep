import { CounsellorReportingInterface } from 'lib/store/slice/reporting-Filter/counsellorEventReporting/counsellorEventReporting.interface';

export function getEventStatusPayload(reportFilter:  CounsellorReportingInterface, patientId?:string) {
  return {
    ...reportFilter,
    all: patientId ? false : reportFilter.all,
    filterUsers: patientId ? [{ patientId }] : reportFilter.filterUsers.map(d => { return { patientId: d.patientId }; }),
  };
}