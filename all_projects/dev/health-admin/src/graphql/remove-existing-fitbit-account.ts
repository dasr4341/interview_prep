import { gql } from '@apollo/client';

export const removeExistingFitbit = gql`
  query RemoveExistingFitbit($refreshToken: String!, $accessToken: String!, $fitbitUserId: String!) {
    pretaaHealthSetupDuplicateFitbit(refreshToken: $refreshToken, accessToken: $accessToken, fitbitUserId: $fitbitUserId) {
      accessToken
      patinetId
    }
  }
`;
