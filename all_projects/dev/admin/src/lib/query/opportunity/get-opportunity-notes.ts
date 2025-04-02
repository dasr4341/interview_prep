import { gql } from '@apollo/client';

export const GET_OPPORTUNITY_NOTES_QUERY = gql`
  query PretaaGetOpprtunityNotes($opportunityId: String!, $take: Int, $skip: Int) {
    pretaaGetOpprtunityNotes(opportunityId: $opportunityId, take: $take, skip: $skip) {
      id
      eventId
      companyId
      company {
        id
        name
        starredByUser {
          userId
        }
      }
      text
      subject
      createdBy
      createdAt
      canModify
    }
  }
`;
