import { gql } from '@apollo/client';

export const EventsQuery = gql`
  query GetEvents(
    $selectedOptions: [String!]!
    $phrase: String
    $companyId: String
    $userEventsWhere: UserEventsWhereInput
    $filterRange: DateRangeTypes
    $lastId: String
  ) {
    getFilteredEvents(
      filterList: $selectedOptions
      searchPhrase: $phrase
      companyId: $companyId
      filterRange: $filterRange
      lastId: $lastId
    ) {
      id
      createdAt
      type
      text
      needsAttention
      messageId
      message {
        eventId
      }
      company {
        name
        id
      }
      timelineCount
      launchCount
      noteCount
      userEvents(where: $userEventsWhere) {
        readAt
        flaggedAt
        hideAt
      }
    }
  }
`;
