import { AssessmentPatientsDischargeFilterTypes, ReportingDateFilter } from 'health-generatedTypes';
import { AssessmentFilterInterface } from 'interface/app.slice.interface';

export function getReportFilterVariables({
  filter,
}: {
  filter: AssessmentFilterInterface;
}) {
  return {
    all: filter.selectedPatients.all,
    // eslint-disable-next-line max-len
    filterMonthNDate: filter.selectedDischargeStatusTypes?.value === AssessmentPatientsDischargeFilterTypes.IN_CENSUS ? undefined : filter.selectedDayMonth?.dayMonth?.value as unknown as ReportingDateFilter | null,
    rangeStartDate: filter.selectedDayMonth?.dateRange.startDate,
    rangeEndDate: filter.selectedDayMonth?.dateRange.endDate,
    patients: filter.selectedPatients.list.map(p => {
      return {
        patientId: p.id
      };
    }),
    admittanceStatus: filter.selectedDischargeStatusTypes?.value as AssessmentPatientsDischargeFilterTypes
  };
}
