import { gql } from '@apollo/client';

export const eventCard = gql`
   mutation EventCard(
    $userEventsWhere: UserEventsWhereInput
    $getEventDetailsId: String!
  ) {
    getEventDetails(id: $getEventDetailsId) {
      id
      createdAt
      type
      text
      needsAttention
      messageId
      company {
        name
        id
      }
      userEvents(where: $userEventsWhere) {
        readAt
        flaggedAt
        hideAt
      }
      timelineCount
      launchCount
      noteCount
      message {
        eventId
      }
    }
  }
`;
