import { gql } from '@apollo/client';

export const PretaaAdminUpdateCustomer = gql`
  mutation PretaaAdminUpdateCustomer($customerId: Int!, $status: Boolean) {
    pretaaAdminUpdateCustomer(customerId: $customerId, status: $status) {
      id
      type
      name
      isActive
    }
  }
`;
