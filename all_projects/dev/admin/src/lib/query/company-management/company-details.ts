import gql from 'graphql-tag';

export const CompanyGroupDetails = gql`
  query Company(
    $companyId: String!,
    $contacts: ContactsWhereInput
  ) {
    pretaaGetCompany(companyId: $companyId) {
      employeeCount
      name
      customer {
        name
      }
      contacts(where: $contacts) {
        primary
        name
      }
    }
  }
`;