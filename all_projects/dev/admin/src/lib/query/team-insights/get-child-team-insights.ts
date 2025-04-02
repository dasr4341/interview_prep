import { gql } from '@apollo/client';

export const GetChildTeamInsightsQuery = gql`
  query GetChildTeamInsights(
    $dateRangeType: DateRangeTypes!
    $reporteeUserId: String
    $skip: Int
    $take: Int
  ) {
    # Child User List
    pretaaGetTeamInsightDashboardData(
      dateRangeType: $dateRangeType
      reporteeUserId: $reporteeUserId
      skip: $skip
      take: $take
    ) {
      referencesCount
      launchesCount
      userCompanyRatingsCount
      reportees {
        reportee {
          _count {
            userReportee
          }
          id
          firstName
          lastName
        }
        referencesCount
        launchesCount
        companyRatingsCount
      }
    }

    # Team Need Attention
    pretaaGetTeamCompaniesNeedAttention(
      dateRangeType: $dateRangeType
      reporteeUserId: $reporteeUserId
    ) {
      id
      name
    }

    # Company Need Attention
    pretaaGetCompaniesNeedingAttention(reporteeUserId: $reporteeUserId) {
      id
      name
    }

    # Action Count
    pretaaGetUserActionCounts(dateRangeType: $dateRangeType, reporteeUserId: $reporteeUserId) {
      referenceCount
      launchCount
      ratingCount
      referenceDeletedCount
      starredTotal
      templatesCreatedCount
      needsAttentionRemovedCount
    }

    pretaaGetMyUsedSearchFilters(dateRangeType: $dateRangeType, reporteeUserId: $reporteeUserId) {
      mycompaniesCount
      starredCount
      customerCount
      prospectCount
      referenceCount
      hasServedCount
      hasOfferedCount
      systemGeneratedSurveyedReferenceCount
      productCount
      industryCount
      employeeSeatsCount
      revenueCount
      npsScoreCount
    }
  }
`;
