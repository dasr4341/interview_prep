import { gql } from '@apollo/client';

export const getRelativeDateRangeFilterQuery = gql`
  query GetRelativeDateRangeFilter {
    pretaaHealthGetRelativeDateRangeFilter {
      filterOf {
        YEAR {
          key
          label
        }
        QUARTER {
          key
          label
        }
        MONTH {
          key
          label
        }
        WEEK {
          key
          label
        }
        DAY {
          key
          label
        }
      }
      filterBy {
        key
        label
      }
    }
  }
`;
