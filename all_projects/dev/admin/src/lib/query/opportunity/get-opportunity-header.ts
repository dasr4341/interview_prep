import { gql } from '@apollo/client';

export const GetOpportunityHeaderQuery = gql`
   query GetOpportunityHeader(
    $opportunityId: String!
  ) {
    pretaaGetCompanyOpprtunity(opportunityId: $opportunityId) {
      id
      name
    }
  }
`;
