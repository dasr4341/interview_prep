import { gql } from '@apollo/client';

/**
 * This is once a patient is accepted oauth connection then this for verification of fitbit connection 
 * authorizationCode comes from fitbit. This can be use once fitbit connections invalid and need to re-verify 
 */
export const patientSetUp = gql`
  query SetupFitbit($authorizationCode: String!) {
    pretaaHealthSetupFitbit(authorizationCode: $authorizationCode) {
    __typename
      ... on FitbitAccountExistsResponse {
        fitbitUserId
        accountExists
        accessToken
        refreshToken
      }
      ... on SetupFitbitResponse {
        accessToken
        patinetId
      }
    }
  }
`;
