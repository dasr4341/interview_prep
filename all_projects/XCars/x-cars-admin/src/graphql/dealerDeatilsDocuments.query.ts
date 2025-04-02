import { graphql } from '@/generated/gql';

export const DEALER_DETAILS_DOCUMENTS_QUERY = graphql(`
  query ViewDealerDocuments($dealerId: String!) {
    viewDealer(dealerId: $dealerId) {
      message
      success
      data {
        id
        status
        documents {
          fileType
          docs {
            id
            fileName
            path
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`);
