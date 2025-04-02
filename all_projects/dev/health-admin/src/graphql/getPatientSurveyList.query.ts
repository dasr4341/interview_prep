import { gql } from '@apollo/client';

export const getPatientSurveyList = gql`
query GetPatientSurveysForCounsellor($patientId: String!, $status: SurveyStatusTypePatient!, $skip: Int, $take: Int, $searchPhrase: String) {
  pretaaHealthGetPatientSurveysForCounsellor(patientId: $patientId, status: $status, skip: $skip, take: $take, searchPhrase: $searchPhrase) {
    surveyTemplate {
      createdAt
      description
      name
      type
      id
      updatedAt
      status
      title
    }
    submissionDate
    title
    scheduledAt
    createdAt
    publishedAt
    assignmentId
  }
}
`;