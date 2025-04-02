import { gql } from '@apollo/client';

export const getPatientListModalForCounsellor = gql`
  query GetAdHocSurveysPatientListForCounsellors(
    $surveyId: String!
  ) {
    pretaaHealthGetAdHocSurveysPatientListForCounsellors(
      surveyId: $surveyId
    ) {
      completedAt
      patientFulltName
      patientId
      score
    }
  }
`;
