import { gql } from '@apollo/client';

export const getTotalSurveyCount = gql`
  query GetTotalSurveySubmitBySelectedCliniciansReport(
  $filterMonthNDate: ReportingDateFilter
  $filterUsers: [ReportingCliniciansUsers!]
  $rangeEndDate: String
  $rangeStartDate: String
  $all: Boolean
  $careTeamType: CareTeamTypes
) {
  pretaaHealthGetTotalSurveySubmitBySelectedCliniciansReport(
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
    rangeEndDate: $rangeEndDate
    rangeStartDate: $rangeStartDate
    all: $all
    careTeamType: $careTeamType
  ) {
    label
    value
  }
}

`;
