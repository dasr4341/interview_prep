import { graphql } from '@/generated/gql';

export const ALL_TRANSACTIONS = graphql(`
  query GetPaymentHistoryList {
    getPaymentHistoryList {
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
        userName
        userId
        razorpayPaymentId
        amount
        invoiceStatus
        amountPaid
        amountDue
        receipt
        createdAt
        updatedAt
        userRole
        carDetail
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
