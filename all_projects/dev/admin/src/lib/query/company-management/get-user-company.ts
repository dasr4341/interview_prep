import { gql } from '@apollo/client';

export const GetUsersCompaniesQuery = gql`
  query GetUsersCompanies(
    $userId: String!, 
    $take: Int, 
    $skip: Int
  ) {
    pretaaGetUsersCompanies (
      userId: $userId, 
      take: $take, 
      skip: $skip
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
    }
  }
`;
