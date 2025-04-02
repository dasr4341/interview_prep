import { gql } from '@apollo/client';

export const UpdateDynamicCompanyFieldsMutation = gql`
  mutation UpdateDynamicCompanyFields(
    $columns: [Int!]!
    $type: String!
    $order: [Int!]
    $display: [Boolean!]
  ) {
    pretaaUpdateDynamicCompanyFields(
      columns: $columns
      type: $type
      order: $order
      display: $display
    ) {
      id
      fieldName
    }
  }
`;