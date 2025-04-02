import { gql } from '@apollo/client';

export const getSurveysForPatient = gql`
  query GetSurveysForPatient($skip: Int, $take: Int, $status: SurveyStatusTypePatient, $searchPhrase: String) {
    pretaaHealthGetPatientSurveys(skip: $skip, take: $take, status: $status, searchPhrase: $searchPhrase) {
      id
      isCompleted
      scheduledAt
      createdAt
      submissionDate
      publishedAt
      title
      surveyTemplate {
        name
        type
        description
      }
      surveyId
    }
  }
`;
