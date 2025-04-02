import { gql } from '@apollo/client';

export const getInsightsMixPanelQuery = gql`
  query InsightsMixPanel($dateRangeType: DateRangeTypes!) {
    pretaaGetAverageSession(dateRangeType: $dateRangeType) {
      average
      averageCount
      totalCount
    }
  }
`;
