import { gql } from '@apollo/client';

export const reportingEventSearchQuery = gql`
query ReportingEventSearch(
  $searchPhrase: String
  $take: Int
  $skip: Int
  $filterMonthNDate: EventReportingDateFilterTypes
  $eventType: [EventFilterTypes!]
  $rangeEndDate: String
  $rangeStartDate: String
  $lastNumber: Float
  $all: Boolean
  $selfHarm: Boolean
  $patientId: String
  $trigger: Boolean
) {
  pretaaHealthReportingEventSearch(
    searchPhrase: $searchPhrase
    take: $take
    skip: $skip
    filterMonthNDate: $filterMonthNDate
    eventType: $eventType
    rangeEndDate: $rangeEndDate
    rangeStartDate: $rangeStartDate
    lastNumber: $lastNumber
    all: $all
    selfHarm: $selfHarm
    patientId: $patientId
    trigger: $trigger
  ) {
    id
    text
    textDetail
    createdAt
    type
    eventAt
    consolidated
    patientSupporterEventAction
    frequency
    patientId
    userevent {
      createdAt
      eventId
      flaggedAt
      id
      hideAt
      readAt
      userId
    }
    surveyAssignmentDetails {
      createdAt
      id
      isCompleted
    }
    surveyAssignmentId
  }
}
`;