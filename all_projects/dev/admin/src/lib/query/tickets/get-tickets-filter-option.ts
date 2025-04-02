import { gql } from '@apollo/client';

export const GetTicketsFilterOptionsQuery = gql`
  query GetTicketsFilterOptions {
    pretaaGetTicketsFilterOptions {
      value
      displayValue
      type
    }
  }
`;
