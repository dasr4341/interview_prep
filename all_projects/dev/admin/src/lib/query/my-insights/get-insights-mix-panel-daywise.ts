import { gql } from '@apollo/client';

export const getInsightsMixPanelDayWiseQuery = gql`
  query InsightsMixPanelByDay($dateRangeType: DateRangeTypes!, $day: String!) {
    pretaaGetPopularViewingTimes(dateRangeType: $dateRangeType, day: $day) {
      popularViews {
        time
        duration
      }
    }
  }
`;
