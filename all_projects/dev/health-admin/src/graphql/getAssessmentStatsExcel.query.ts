import { gql } from '@apollo/client';

export const getAssessmentStatsExcelDownload = gql`
  query AssessmentStatsExcelDownload(
    $all: Boolean!
    $code: String!
    $filterMonthNDate: ReportingDateFilter
    $rangeStartDate: String
    $rangeEndDate: String
    $admittanceStatus: AssessmentPatientsDischargeFilterTypes
    $patients: [AssessmentReportingPatientsIds!]
  ) {
    pretaaHealthDownloadAssessmentReport(
      all: $all
      code: $code
      filterMonthNDate: $filterMonthNDate
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      admittanceStatus: $admittanceStatus
      patients: $patients
    )
  }
`;