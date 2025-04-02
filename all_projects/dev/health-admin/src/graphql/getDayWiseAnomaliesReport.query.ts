import { gql } from '@apollo/client';

export const getDayWiseAnomaliesReport = gql`
  query GetDayWiseAnomaliesReport(
  $all: Boolean
  $rangeStartDate: String
  $rangeEndDate: String
  $lastNumber: Float
  $filterMonthNDate: EventReportingDateFilterTypes
  $filterUsers: [RepotingPatientUsers!]
) {
  pretaaHealthGetDayWiseAnomaliesReport(
    all: $all
    rangeStartDate: $rangeStartDate
    rangeEndDate: $rangeEndDate
    lastNumber: $lastNumber
    filterMonthNDate: $filterMonthNDate
    filterUsers: $filterUsers
  ) {
    label
    heart_anomaly
    hrv_anomaly
    sleep_anomaly
    spo2_anomaly
    temp_anomaly
  }
}

`;
