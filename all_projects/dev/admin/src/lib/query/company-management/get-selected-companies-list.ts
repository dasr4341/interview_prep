import { gql } from '@apollo/client';

export const getSelectedCompanyListQuery = gql`
  query GetSelectedCompanyList($listId: String!, $take: Int, $skip: Int, $where: ListCompanyWhereInput) {
    pretaaGetList(listId: $listId) {
      id
      
      listCompanies(take: $take, skip: $skip, where: $where) {
        companyId
        listId
        company {
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
        }
      }
    }
  }
`;
