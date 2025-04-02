import { graphql } from '@/generated/gql';

export const ASSIGN_LEADS_TO_DEALER = graphql(`
  mutation AssignLeadsToDealer($leads: [String!]!) {
    assignLeadsToDealer(leads: $leads) {
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
        }
        callCount
        activeQuotation
        assigned
      }
    }
  }
`);
