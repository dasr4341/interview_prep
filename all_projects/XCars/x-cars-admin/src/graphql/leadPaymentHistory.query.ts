import { graphql } from '@/generated/gql';

export const LEAD_PAYMENT_HISTORY = graphql(`
  query GetLeadPaymentHistoryList(
    $page: Float
    $userId: String
    $limit: Float
    $filter: [UserInvoiceFilterInput!]
  ) {
    getPaymentHistoryList(
      page: $page
      userId: $userId
      limit: $limit
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
