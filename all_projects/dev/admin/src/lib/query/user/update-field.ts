import { gql } from '@apollo/client';

export const updateUserField = gql`
  mutation UpdateUserField(
    $display: [Boolean!]
    $columns: [Float!]!
    $type: String!
    $order: [Float!]
  ) {
    pretaaUpdateDynamicUserFields(
      display: $display
      columns: $columns
      type: $type
      order: $order
    ) {
      id
      fieldName
      order
      display
    }
  }
`;
