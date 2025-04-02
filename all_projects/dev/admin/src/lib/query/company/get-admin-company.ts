import { gql } from '@apollo/client';

export const GetAdminCompanyQuery = gql`
  query GetAdminCompany($companyId: String!, $contactsWhere: ContactsWhereInput) {
    pretaaGetCompanyAdmin(companyId: $companyId) {
      expectedToCloseAt
      companyType
      noteCount
      id
      annualRecurringRevenueVal {
        data
        hasAccess
      }
      employeeCount
      name
      customerId
      employeeCountGroup
      starredByUser {
        userId
      }
      renewalDate
      contacts(where: $contactsWhere) {
        primary
        name
        id
      }
      customer {
        name
      }
    }
  }
`;
