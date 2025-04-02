import { gql } from '@apollo/client';

export const suicidalIdeationPatientListReport = gql`
  query GetSuicidalIdeationPatientListReport(
    $skip: Int
    $take: Int
    $all: Boolean
    $rangeStartDate: String
    $rangeEndDate: String
    $lastNumber: Float
    $filterMonthNDate: EventReportingDateFilterTypes
    $filterUsers: [RepotingPatientUsers!]
  ) {
    pretaaHealthGetSuicidalIdeationPatientListReport(
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
      name
      primaryTherapist
      caseManager
      selfHarmCount
      dischargeDate
      intakeDate
      facilityName
    }
  }
`;
