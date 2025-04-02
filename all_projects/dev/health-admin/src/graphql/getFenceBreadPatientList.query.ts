import { gql } from '@apollo/client';

export const getFenceBreadPatientList = gql`
  query PretaaHealthGetFenceBreachPatientsReport(
    $skip: Int
    $take: Int
    $all: Boolean
    $rangeStartDate: String
    $rangeEndDate: String
    $lastNumber: Float
    $filterMonthNDate: EventReportingDateFilterTypes
    $filterUsers: [RepotingPatientUsers!]
  ) {
    pretaaHealthGetFenceBreachPatientsReport(
      skip: $skip
      take: $take
      all: $all
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
      breachCountIn
      breachCountOut
      dischargeDate
      intakeDate
      facilityName
    }
  }
`;
