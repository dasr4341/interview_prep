import { gql } from '@apollo/client';

export const getUserQuery = gql`
  query GetUser {
    pretaaHealthCurrentUser {
      email
      id
      kipuVerified
      lastLoginTime
      lockTime
      timezone
      stripeCustomerId
      receiveEmails
      patientId
      sentInvite
      firstName
      lastName
      isClinicalDirector
      twoFactorAuthentication
      paidPaymentBy
      stripePublishableKey
      stripePriceId
      fitbitTokenInvalid
      patientDetails {
        platformType
        appleTokenInvalid
      }
      patientPermissionToSupporter
      userRoles {
        name
        roleSlug
      }
      userFacilities {
        id
        name
      }
    }
    pretaaHealthGetCurrentUserPermissions {
      capabilities {
        CREATE
        DELETE
        EDIT
        EXECUTE
        VIEW
      }
      label
      name
    }
  }
`;
