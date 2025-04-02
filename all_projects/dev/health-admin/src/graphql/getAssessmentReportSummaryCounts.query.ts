import { gql } from '@apollo/client';

export const getAssessmentReportSummaryCountsQuery = gql`
query GetAssessmentReportSummaryCounts(
  $all: Boolean!
  $filterMonthNDate: ReportingDateFilter
  $rangeStartDate: String
  $rangeEndDate: String
  $patients: [AssessmentReportingPatientsIds!]
  $admittanceStatus: AssessmentPatientsDischargeFilterTypes
) {
  pretaaHealthGetAssessmentReportSummaryCounts(
    all: $all
    filterMonthNDate: $filterMonthNDate
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    patients: $patients
    admittanceStatus: $admittanceStatus
  ) {
    name
    count
  }
}
`;
