import { graphql } from '@/generated/gql';

export const CONTACT_FORM_DETAILS = graphql(`
  query GetContactData($page: Float, $limit: Float) {
    getContactData(page: $page, limit: $limit) {
      message
      success
      data {
        id
        contactMessage {
          message
          createdAt
          updatedAt
        }
        alternatePhone
        alternateEmail
        car {
          id
          launchYear
          totalRun
          noOfOwners
          model
          companyName
          variant
          registrationNumber
          fuelType
          transmission
          status
          createdAt
          updatedAt
        }
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
