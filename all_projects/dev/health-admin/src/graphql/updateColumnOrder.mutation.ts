import { gql } from '@apollo/client';

export const updateColumnOrderMutation = gql`
  mutation AgGridColumnManagement(
    $agGridListType: AgGridListTypes!
    $columns: [ColumnObjectArgs!]!
  ) {
    pretaaHealthAgGridColumnManagement(
      agGridListType: $agGridListType
      columns: $columns
    ) {
      id
      columnList
    }
  }
`;
