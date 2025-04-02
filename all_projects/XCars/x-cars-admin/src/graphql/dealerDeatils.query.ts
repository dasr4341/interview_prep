import { graphql } from '@/generated/gql';

export const DEALER_DETAILS_QUERY = graphql(`
  query ViewDealer($dealerId: String!) {
    viewDealer(dealerId: $dealerId) {
      message
      success
      data {
        id
        firstName
        lastName
        companyName
        location
        status
        email
        phoneNumber
        documents {
          fileType
          docs {
            id
            fileName
            path
            amount
            currency
            thumbnail
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`);
