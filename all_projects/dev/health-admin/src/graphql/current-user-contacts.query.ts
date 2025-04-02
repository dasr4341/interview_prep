import { gql } from '@apollo/client';

export const userContacts = gql`
 query GetUserContacts {
  pretaaHealthCurrentUser {
    patientContactList {
      careTeams {
        id
        firstName
        lastName
        fullName
        title
        email
        phone
        careTeamTypes
      }
      patientContacts {
        id
        patientId
        fullName
        relationship
        contactType
        phone
        alternativePhone
        address
        email
        notes
        createdAt
        url
        dob
        company
        canDelete
      }
      suppoters {
        email
        id
        mobilePhone
        firstName
        lastName
        canDeleteSupporter
      }
    }
  }
}
`;
