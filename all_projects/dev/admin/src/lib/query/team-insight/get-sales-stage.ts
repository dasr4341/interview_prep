import { gql } from '@apollo/client';

export const getSaleStagesQuery = gql`
  query GetSalesStages {
    pretaaGetSalesStages {
      id
      displayName
    }
  }
`;
