import { graphql } from '@/generated/gql';

export const GET_LEADS_QUERY = graphql(`
  query GetAdminLeads(
    $leadId: String
    $page: Float
    $limit: Float
    $filter: [LeadFilterInput!]
  ) {
    getAdminLeads(
      leadId: $leadId
      page: $page
      limit: $limit
      filter: $filter
    ) {
      message
      success
      data {
        id
        carId
        userId
        contact {
          id
          contactMessage {
            message
            createdAt
            updatedAt
          }
          alternatePhone
          alternateEmail
          carId
        }
        leadType
        status
        user {
          id
          firstName
          lastName
          profileImage
          companyName
          location
          status
          email
          phoneNumber
          documents {
            id
            userId
            fileName
            path
          }
        }
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
          userId
          quotation {
            id
            status
            createdAt
            quotationDetails {
              noOfLeads
              validityDays
              amount
              currency
              expiryDate
              startDate
            }
          }
          products {
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
          carGallery {
            id
            fileType
            thumbnail
            CarGalleryDocuments {
              id
              fileName
              path
              documentType
            }
            createdAt
            updatedAt
          }
          user {
            firstName
            lastName
            id
          }
        }
        callCount
        activeQuotation
        assigned
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
