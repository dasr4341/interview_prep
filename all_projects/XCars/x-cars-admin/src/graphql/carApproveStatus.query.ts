import { graphql } from '@/generated/gql';

export const CHECK_CAR_APPROVE_STATUS = graphql(`
  query CheckCarApproveStatus($carId: String!) {
    checkCarApproveStatus(carId: $carId) {
      message
      success
      data {
        requiredData {
          isCarProductExist
          isCarImageExist
          isCarVideoExist
          isQuotationExist
          isQuotationPaid
          isThumbnailExist
        }
        approveStatus
      }
    }
  }
`);
