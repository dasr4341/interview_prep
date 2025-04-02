import { gql } from '@apollo/client';

export const GET_OPPORTUNITY_CONTACTS_QUERY = gql`
  query GetOpportunityContacts($opportunityId: String!) {
    pretaaGetOpprtunityContacts(opportunityId: $opportunityId) {
      id
      createdAt
      firstName
      lastName
      
      opportunityContact {
        isPrimary
      }
    }
  }
`;
