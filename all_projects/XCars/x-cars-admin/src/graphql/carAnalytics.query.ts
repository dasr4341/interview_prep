import { graphql } from '@/generated/gql';

export const CAR_ANALYTICS = graphql(`
  query GetCarAnalyticsReport(
    $carId: String!
    $lead: Range
    $views: Range
    $product: Range
  ) {
    getCarAnalyticsReport(
      carId: $carId
      lead: $lead
      views: $views
      product: $product
    ) {
      message
      success
      data {
        quotationDetails {
          totalActiveQuotationCount
          totalPendingQuotationCount
          totalCancelledQuotationCount
          totalExpiredQuotationCount
        }
        totalLeadCount
        totalViewCount
        productDetails {
          totalRevenue
          totalProductsSoldCount
          sales {
            fileType
            count
          }
        }
        totalLeadsInRange {
          id
          createdAt
          updatedAt
        }
        totalViewsInRange {
          id
          createdAt
          updatedAt
        }
        totalProductSoldInRange {
          id
          createdAt
          updatedAt
        }
      }
    }
  }
`);
