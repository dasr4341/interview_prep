import { gql } from '@apollo/client';

export const getAnomaliesPatientListReportQuery = gql`
  query GetAnomaliesPatientListReport(
    $skip: Int
    $take: Int
    $all: Boolean
    $rangeEndDate: String
    $rangeStartDate: String
    $lastNumber: Float
    $filterMonthNDate: EventReportingDateFilterTypes
    $filterUsers: [RepotingPatientUsers!]
  ) {
    pretaaHealthGetAnomaliesPatientListReport(
      skip: $skip
      take: $take
      all: $all
      rangeEndDate: $rangeEndDate
      rangeStartDate: $rangeStartDate
      lastNumber: $lastNumber
      filterMonthNDate: $filterMonthNDate
      filterUsers: $filterUsers
    ) {
      daydiff
      id
      scale
      name
      heartAnomaly
      spo2Anomaly
      sleepAnomaly
      hrvAnomaly
      tempAnomaly
      primaryTherapist
      caseManager
      dischargeDate
      intakeDate
      facilityName
    }
  }
`;
