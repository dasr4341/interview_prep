import { gql } from '@apollo/client';

export const GetCompanyQuery = gql`
  query GetCompany(
    $companyId: String!
    $contactsWhere: ContactsWhereInput
    $industryCompanyId: CompanyOnIndustriesWhereInput
  ) {
    pretaaGetCompany(companyId: $companyId) {
      primaryContactId
      fiscalYear
      expectedToCloseAt
      companyType
      timelineCount
      launchCount
      noteCount
      opportunityCount
      referencesCount
      id
      annualRecurringRevenueVal {
        data
        hasAccess
      }
      employeeCount
      name
      customerId
      referredOn
      offeredOn
      surveyedOn
      needsAttention
      contacts(where: $contactsWhere) {
        primary
        name
        id
      }
      starredByUser {
        userId
      }
      annualRecurringRevenueVal {
        data
        hasAccess
      }
      ARRGroup
      NPSScore
      renewalDate
      companyIndustries(where: $industryCompanyId) {
        industry {
          sector
        }
      }
      dataSources {
        label
        url
      }
    }
  }
`;
