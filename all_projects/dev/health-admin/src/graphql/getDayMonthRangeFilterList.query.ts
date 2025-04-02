import { gql } from '@apollo/client';

export const getDayMonthRangeFilterList = gql`
  query GetDayMonthRangeFilterList {
    pretaaHealthGetDayMonthRangeFilterList {
      name
      value
    }
  }
`;
