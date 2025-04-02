import { gql } from '@apollo/client';


export const GetFirstRespondersListQuery = gql`
query GetFirstRespondersList($patinetId: String!) {
  pretaaHealthGetPatientCareTeams(patinetId: $patinetId) {
    user {
      email
      fullName
      firstName
      lastName
      mobilePhone
      id
      userRoles {
        name
      }
    }
  }
}
`;