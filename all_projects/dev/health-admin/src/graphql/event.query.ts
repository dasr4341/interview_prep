import { gql } from '@apollo/client';

export const eventQuery = gql`
  query PretaaHealthEventSearch(
  $dateRange: DateRangArgs
  $eventType: [EventFilterTypes!]
  $patientId: String
  $searchPhrase: String
  $skip: Int
  $take: Int
  $selfHarm: Boolean
  $trigger: Boolean
  $dateFilter: ReportingDateFilter
) {
  pretaaHealthEventSearch(
    dateRange: $dateRange
    eventType: $eventType
    patientId: $patientId
    searchPhrase: $searchPhrase
    skip: $skip
    take: $take
    selfHarm: $selfHarm
    trigger: $trigger
    dateFilter: $dateFilter
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
    surveyId
  }
}

`;
