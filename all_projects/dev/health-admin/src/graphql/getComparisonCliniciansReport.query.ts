import { gql } from '@apollo/client';


export const getComparisonCliniciansReportQuery = gql`
 query GetComparisonCliniciansReport(
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $filterMonthNDate: ReportingDateFilter
  $filterUsers: [RepotingClinicianUsers!]
  $careTeamType: CareTeamTypes
) {
  pretaaHealthGetComparasionCliniciansReport(
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
    careTeamType: $careTeamType
  ) {
    columns {
      key
      label
    }
    result
  }
}
`;