import { gql } from '@apollo/client';

export const GetCompanyFilteredEventsQuery = gql`
  query GetCompanyFilteredEvents(
    $selectedOptions: [String!]!
    $phrase: String
    $companyId: String
    $userEventsWhere: UserEventsWhereInput
    $filterRange: DateRangeTypes
    $lastId: String
  ) {
    getCompanyFilteredEvents(
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
      message {
        eventId
      }
    }
  }
`;

