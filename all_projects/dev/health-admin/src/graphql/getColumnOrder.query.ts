import { gql } from '@apollo/client';

export const getColumnOrderQuery = gql`
  query GetAgGridColumn($agGridListType: AgGridListTypes!) {
  pretaaHealthGetAgGridColumn(agGridListType: $agGridListType) {
    columnList
  }
}
`;
