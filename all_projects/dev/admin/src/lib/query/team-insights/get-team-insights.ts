import { gql } from '@apollo/client';

export const GetTeamInsightsQuery = gql`
  query GetTeamInsights($dateRangeType: DateRangeTypes!, $take: Int, $skip: Int) {
    pretaaGetTeamInsightDashboardData(
      dateRangeType: $dateRangeType
      take: $take
      skip: $skip
    ) {
      referencesCount
      launchesCount
      userCompanyRatingsCount
      reportees {
        reportee {
          firstName
          lastName
          _count {
            userReportee
          }
          id
        }
        referencesCount
        launchesCount
        companyRatingsCount
      }
    }
    pretaaGetTeamCompaniesNeedAttention(dateRangeType: $dateRangeType) {
      id
      name
    }
  }
`;
