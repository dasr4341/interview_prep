import { gql } from '@apollo/client';

export const getCompanyForEvent = gql`
  query GetCompanyForEvent($companyId: String!) {
    pretaaGetCompany(companyId: $companyId) {
      expectedToCloseAt
      primaryContactId
      createdAt
      primaryContact {
        name
      }
      name
      employeeCount
      leadSource {
        id
        name
        title
      }
    }
  }
`;
