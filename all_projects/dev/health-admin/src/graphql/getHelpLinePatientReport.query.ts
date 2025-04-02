import { gql } from '@apollo/client';

export const getHelpLinePatientReport = gql`
  query GetHelplinePatientsReport(
    $all: Boolean
    $skip: Int
    $take: Int
    $rangeStartDate: String
    $rangeEndDate: String
    $lastNumber: Float
    $filterMonthNDate: EventReportingDateFilterTypes
    $filterUsers: [RepotingPatientUsers!]
  ) {
    pretaaHealthGetHelplinePatientsReport(
      all: $all
      skip: $skip
      take: $take
      rangeStartDate: $rangeStartDate
      rangeEndDate: $rangeEndDate
      lastNumber: $lastNumber
      filterMonthNDate: $filterMonthNDate
      filterUsers: $filterUsers
    ) {
      id
      email
      firstName
      lastName
      HelplineCountCall
      HelplineCountText
      caseManager
      primaryTherapist
      dischargeDate
      intakeDate
      facilityName
    }
  }
`;
