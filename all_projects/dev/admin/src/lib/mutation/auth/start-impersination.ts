import { gql } from '@apollo/client';

export const startImpersonation = gql`
  mutation StartImpersonation($customerId: Int!) {
    pretaaAdminImpersonateUser(customerId: $customerId) {
      loginToken
      refreshToken
    }
  }
`;
