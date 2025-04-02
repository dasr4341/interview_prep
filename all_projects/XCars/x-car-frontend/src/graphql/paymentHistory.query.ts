import { graphql } from '@/generated/gql';
export const PAYMENT_HISTORY = graphql(`
  query GetPaymentHistory($paymentId: String!) {
    getPaymentHistory(paymentId: $paymentId) {
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
    }
  }
`);
