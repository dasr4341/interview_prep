import { graphql } from '@/generated';

export const UPDATE_DEALER_STATUS = graphql(`
  mutation UpdateDealerStatus(
    $updateDealerStatusId: String!
    $status: Application!
  ) {
    updateDealerStatus(id: $updateDealerStatusId, status: $status) {
      message
      success
    }
  }
`);
