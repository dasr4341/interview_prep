import { gql } from '@apollo/client';

export const GetHustleQuery = gql`
  query GetHustle($id: String!) {
    pretaaGetHustleAction(hustleId: $id) {
      id
      sendToAddress
      subject
      text
      companyId
      createdAt
      eventId
      user {
        id
        email
        firstName
        lastName
      }
      hustleContacts {
        contact {
          id
          email
          name
        }
      }
      event {
        id
        createdAt
        type
        text
        messageId
        needsAttention
        timelineCount
        launchCount
        noteCount
        message {
          eventId
        }
        company {
          name
          id
        }
        userEvents {
          readAt
          flaggedAt
          hideAt
        }
      }
    }
  }
`;
