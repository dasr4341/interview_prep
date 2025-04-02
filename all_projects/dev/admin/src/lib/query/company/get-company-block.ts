import { gql } from '@apollo/client';

export const getCompanyBlockQuery = gql`
  query GetCompanyBlock($companyId: String!, $where: ContactsWhereInput) {
    pretaaGetCompany(companyId: $companyId) {
      id
      name

      companyType
      offeredOn
      surveyedOn
      fiscalYear
      employeeCount
      nps {
        hasAccess,
        data
      }

      expectedToCloseAt

      # Customer
      renewalDate
      annualRecurringRevenueVal {
        data
        hasAccess
      }
      closeDate

      companyIndustries {
        industry {
          sector
        }
        industryId
      }

      contacts(where: $where) {
        id
        email
        name
      }

      leadSource {
        id
        name
      }
      products {
        id
        name
      }
    }
  }
`;
