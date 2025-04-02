import gql from 'graphql-tag';

export const GetCompetitorsQuery = gql`
  query GetCompetitors(
    $skip: Int
    $take: Int
    $companyId: String!
    $opportunityId: String
  ) {
    pretaaGetCompetitor(
      skip: $skip
      take: $take
      companyId: $companyId
      opportunityId: $opportunityId
    ) {
      id
      name
      companyId
    }
  }
`;
