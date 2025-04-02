import { gql } from '@apollo/client';

export const surveyDetailsForFacility = gql`
  query FacilitySurveyWithAnswer($userId: String!, $surveyId: String!) {
    pretaaHealthGetSurveyWithAnswer(userId: $userId, surveyId: $surveyId) {
      assessment
      browser
      createdAt
      createdby {
        lastName
        firstName
      }
      patientDetails {
        firstName
        lastName
        email
      }
      surveyFields {
        id
        label
        inputType
        questionName
        parentQuestionName
        placeholder
        rangeValue
        step
        value
        skip
        validation {
          conditionalValidation
        }
        options {
          id
          label
          value
        }
      }
      device
      id
      ipAddress
      os
      submissionDate
      surveyStartedAt
      surveyFinishedAt
      surveyTemplate {
        description
        name
        type
        title
      }
      timezone
      templateText
      signature
      scoreTable
      surveyId
      patientMRNumber
    }
  }
`;

