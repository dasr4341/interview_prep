import { graphql } from '@/generated/gql';

export const PAYMENT_HISTORY_LIST = graphql(`
  query GetPaymentHistoryList(
    $page: Float
    $limit: Float
    $userId: String
    $filter: [UserInvoiceFilterInput!]
  ) {
    getPaymentHistoryList(
      page: $page
      limit: $limit
      userId: $userId
      filter: $filter
    ) {
      message
      success
      data {
        id
        quotationId
        quotation {
          car {
            registrationNumber
          }
        }
        razorpayOrderId
        productsPurchased {
          id
          fileType
          productType
          amount
          discountedAmount
          currency
          thumbnail
          documents {
            id
            fileName
            path
            documentType
          }
          createdAt
          updatedAt
        }
        bundleDetails {
          id
          fileType
          productType
          amount
          discountedAmount
          currency
          thumbnail
          createdAt
          updatedAt
        }
        carId
        userId
        razorpayPaymentId
        amount
        invoiceStatus
        amountPaid
        amountDue
        receipt
        createdAt
        updatedAt
      }
      pagination {
        maxPage
        currentPage
        total
        limit
      }
    }
  }
`);
