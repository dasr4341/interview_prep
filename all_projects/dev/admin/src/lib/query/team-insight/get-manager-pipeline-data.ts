import { gql } from '@apollo/client';

export const getPipelineDataForManagerQuery = gql`
  query PretaaGetPipelineDataForManager($reporteeUserId: String) {
    pretaaGetPipelineDataForManager(reporteeUserId: $reporteeUserId) {
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
  }
`;
