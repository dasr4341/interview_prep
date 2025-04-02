import { gql } from '@apollo/client';

export const getTeamDetailsQuery = gql`
  query GetTeamDetails($dateRangeType: DateRangeTypes!, $reporteeUserId: String!) {
    pretaaGetUserActionCounts(dateRangeType: $dateRangeType, reporteeUserId: $reporteeUserId) {
      referenceCount
      launchCount
      ratingCount
    }

    pretaaGetPipelineData(reporteeUserId: $reporteeUserId) {
      totalRevenue
      totalOpportunity
      totalPercentage
      pipelineData {
        label
        revenueAmount
        opportunity
        percentage
      }
    }

    # pretaaGetCompanyListForTeamDashboard(reporteeUserId: $reporteeUserId) {
    #   id
    #   name
    # }

    pretaaGetUserDetails(userId: $reporteeUserId) {
      id
      name
    }
  }
`;
