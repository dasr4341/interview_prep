import { gql } from '@apollo/client';

export const getMyInsightsQuery = gql`
  query GetMyInsights($dateRangeType: DateRangeTypes!) {
    pretaaGetCompaniesNeedingAttention(take: 5) {
      id
      name
    }
    pretaaGetUserActionCounts(dateRangeType: $dateRangeType) {
      referenceCount
      launchCount
      ratingCount
      referenceDeletedCount
      starredTotal
      templatesCreatedCount
      needsAttentionRemovedCount
    }
    pretaaGetMyUsedSearchFilters(dateRangeType: $dateRangeType) {
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
