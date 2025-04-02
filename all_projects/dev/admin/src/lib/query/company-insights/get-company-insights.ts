import { gql } from '@apollo/client';

export const getCompanyInsightsQuery = gql`
  query pretaaGetCompanyInsights(
    $companyId: String
    $reporteeUserId: String
    $companyType: GeneralCompaniesOptions
    $dateRangeType: DateRangeTypes!
  ) {
    # For chart
    pretaaGetEventsCountSeries(
      companyId: $companyId
      reporteeUserId: $reporteeUserId
      companyType: $companyType
      dateRangeType: $dateRangeType
    ) {
      eventType
      timeSeriesData {
        count
        date
      }
    }
  }
`;
