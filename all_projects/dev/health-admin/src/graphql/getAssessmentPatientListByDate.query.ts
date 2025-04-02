import { gql } from '@apollo/client';


export const getAssessmentPatientListByDateQuery = gql`
  query GetAssessmentPatientListByDate(
  $filterMonthNDate: ReportingDateFilter
  $rangeStartDate: String
  $rangeEndDate: String
  $searchText: String
  $admittanceStatus: AssessmentPatientsDischargeFilterTypes
) {
  pretaaHealthGetPatientListByDate(
    filterMonthNDate: $filterMonthNDate
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    searchText: $searchText
    admittanceStatus: $admittanceStatus
  ) {
    id
    name
  }
}
`; 