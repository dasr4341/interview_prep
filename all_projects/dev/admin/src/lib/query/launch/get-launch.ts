import { gql } from '@apollo/client';

export const GetLaunchQuery = gql`
  query GetLaunch($id: String!) {
    pretaaGetLaunchAction(id: $id) {
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
      launch {
        id
        text
        subject
        eventId
        companyId
        opportunityId
        createdAt
        sendToAddress
        launchContacts {
          contact {
            id
            email
            name
          }
        }
        user {
          id
          email
          firstName
          lastName
        }
      }
    }
  }
`;
