import { gql } from '@apollo/client';

export const surveyPatientList = gql`
  query PatientListForSurvey($surveyId: String!) {
    pretaaHealthGetSurvey(surveyId: $surveyId) {
      surveyAssignments {
        patient {
          email
          id
          lastName
          firstName
        }
      }
    }
  }
`;