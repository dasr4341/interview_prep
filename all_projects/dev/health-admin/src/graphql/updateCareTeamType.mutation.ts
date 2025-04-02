import { gql } from '@apollo/client';

export const UpdateCareTeamTypeQuery = gql`
  mutation UpdateCareTeamType(
    $PRIMARY_CASE_MANAGER: String
    $PRIMARY_NURSE: String
    $PRIMARY_PHYSICIAN: String
    $PRIMARY_THERAPIST: String
    $CLINICAL_DIRECTOR: String
    $ALUMNI_DIRECTOR: String
  ) {
    pretaaHealthUpdateCareTeamType(
      PRIMARY_CASE_MANAGER: $PRIMARY_CASE_MANAGER
      PRIMARY_NURSE: $PRIMARY_NURSE
      PRIMARY_PHYSICIAN: $PRIMARY_PHYSICIAN
      PRIMARY_THERAPIST: $PRIMARY_THERAPIST
      CLINICAL_DIRECTOR: $CLINICAL_DIRECTOR
      ALUMNI_DIRECTOR: $ALUMNI_DIRECTOR
    )
  }
`;
