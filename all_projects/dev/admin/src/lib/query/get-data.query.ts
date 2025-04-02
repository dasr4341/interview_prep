import { gql } from '@apollo/client';

export const getDataQuery = gql`
  query PretaaGetData {
    pretaaGetDateRangeTypes
    pretaaGetSalesStages {
      id
      displayName
    }
  }
`;
