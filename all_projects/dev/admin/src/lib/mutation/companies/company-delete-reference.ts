import { gql } from '@apollo/client';

export const deleteReference = gql`
  mutation DeleteCompanyReference($companyId: String!) {
    pretaaDeleteReference(companyId: $companyId) {
      id
    }
  }
`;
