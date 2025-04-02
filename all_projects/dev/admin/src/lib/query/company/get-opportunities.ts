import { gql } from '@apollo/client';

export const PretaaGetCompanyOpprtunities = gql`
  query GetCompanyOpportunities($companyId: String!, $take: Int) {
    pretaaGetCompanyOpprtunities(companyId: $companyId, take: $take) {
      id
      name
    }
  }
`;
