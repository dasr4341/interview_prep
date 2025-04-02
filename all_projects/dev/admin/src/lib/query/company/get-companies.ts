import { gql } from '@apollo/client';

export const GetCompaniesQuery = gql`
  query GetCompanies(
    $getFilteredCompaniesFilterList: [String!]!
    $getFilteredCompaniesSearchPhrase: String
    $getFilteredCompaniesSkip: Int
    $getFilteredCompaniesOrder: String
    $getFilteredCompaniesOrderBy: OrderType
    $excludeId: String
    $filterObj: PretaaCompanyFilterInput!
  ) {
    pretaaGetFilteredCompanies(
      filterList: $getFilteredCompaniesFilterList
      searchPhrase: $getFilteredCompaniesSearchPhrase
      skip: $getFilteredCompaniesSkip
      order: $getFilteredCompaniesOrder
      orderBy: $getFilteredCompaniesOrderBy
      excludeId: $excludeId
      filterObj: $filterObj
    ) {
      id
      name
      customerId
      starredByUser {
        userId
      }
      companyType
    }
  }
`;
