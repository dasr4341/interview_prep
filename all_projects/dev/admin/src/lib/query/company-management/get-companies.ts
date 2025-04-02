import { gql } from '@apollo/client';

export const GetCompanyMngtListQuery = gql`
  query GetCompanyMngtList(
    $searchPhrase: String
    $filterList: [String!]!
    $searchColumn: String
    $take: Int
    $skip: Int
    $filterObj: PretaaCompanyFilterInput!
    $where: ListCompanyWhereInput
  ) {
    getFilteredCompaniesAdmin(
      searchPhrase: $searchPhrase
      filterList: $filterList
      searchColumn: $searchColumn
      take: $take
      skip: $skip
      filterObj: $filterObj
    ) {
      id
      customerId
      name
      companyType
      employeeCount
      fiscalYearStartMonth
      annualRecurringRevenueVal {
        data
        hasAccess
      }
      dynamicFields
      ARRGroup
      fiscalYear
      NPSScore
      listCompanies(where: $where) {
        listId
      }
    }
  }
`;
