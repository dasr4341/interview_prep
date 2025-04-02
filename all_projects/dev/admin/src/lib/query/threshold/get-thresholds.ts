import { gql } from '@apollo/client';

export const getThresholdsQuery = gql`
  query GetThresholds {
    pretaaGetThresholds
    pretaaGetSalesStages {
      name
      order
      displayName
      customerId
    }
  }
`;
