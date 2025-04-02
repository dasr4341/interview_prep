import { gql } from '@apollo/client';

export const assessmentEventListQuery = gql`
query AssessmentEventList($parentEventId: String!, $patientId: String!) {
  pretaaHealthAssessmentEventList(
    parentEventId: $parentEventId
    patientId: $patientId
  ) {
    text
    textDetail
    createdAt
    type
    id
    patientId
    surveyAssignmentDetails {
      id
    }
  }
}
`;