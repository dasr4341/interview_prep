import { gql } from '@apollo/client';

export const getPipelineDataQuery = gql`
  query GetPipelineData(
    $reporteeUserId: String,
    $companyIds: [String!]
  ) {
    pretaaGetPipelineData(
      reporteeUserId: $reporteeUserId,
      companyIds: $companyIds
    ) {
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
