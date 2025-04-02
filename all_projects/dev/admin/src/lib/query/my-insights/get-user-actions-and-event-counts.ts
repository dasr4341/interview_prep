import { gql } from '@apollo/client';

export const getUserActionsAndEventCountsQuery = gql`
  query GetUserActionsAndEventCountsQuery(
    $dateRangeType: DateRangeTypes!
    $companiesFilter: CompaniesFilter
    $companyId: String
  ) {
    pretaaGetUserActionCounts(dateRangeType: $dateRangeType) {
      referenceCount
      launchCount
      ratingCount
    }
    pretaaGetEventCounts(dateRangeType: $dateRangeType, companiesFilter: $companiesFilter, companyId: $companyId) {
      type
      _count {
        id
      }
      text
    }
  }
`;
