import { gql } from '@apollo/client';

export const generalPopulationList = gql`
  query GetGeneralPopulationPatientList(
    $skip: Int
    $take: Int
    $filterMonthNDate: ReportingDateFilter
    $filterUsers: [RepotingClinicianUsers!]
    $all: Boolean
    $rangeStartDate: String
    $rangeEndDate: String
    $templateCodes: [SurveyTemplateCodes!]
    $careTeamType: CareTeamTypes
  ) {
    pretaaHealthGetGeneralPopulationPatientList(
      skip: $skip
      take: $take
      filterMonthNDate: $filterMonthNDate
      filterUsers: $filterUsers
      all: $all
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      templateCodes: $templateCodes
      careTeamType: $careTeamType
    ) {
      columns
      listData
    }
  }
`;
