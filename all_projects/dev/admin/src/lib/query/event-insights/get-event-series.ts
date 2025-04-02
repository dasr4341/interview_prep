import { gql } from '@apollo/client';

export const getEventsCountSeriesQuery = gql`
  query PretaaGetEventsCountSeries($dateRangeType: DateRangeTypes!) {
    pretaaGetEventsCountSeries(dateRangeType: $dateRangeType) {
      eventType
      timeSeriesData {
        count
        date
      }
    }
  }
`;
