import { gql } from '@apollo/client';

export const surveyDetailsQuery = gql`
  query GetPatientSurvey($surveyId: String!) {
    pretaaHealthGetPatientSurvey(surveyId: $surveyId) {
      id
      submissionDate
      createdAt
      surveyTemplate {
        title
        type
        name
        description
        templateInfo
      }
      surveyFields {
        parentQuestionName
        questionName
        id
        inputType
        label
        options {
          id
          label
          value
        }
        placeholder
        skip
        rangeValue
        validation {
          conditionalValidation
          maxLength {
            active
            message
          }
          minLength {
            active
            message
          }
          patternValidation {
            active
            message
          }
          required {
            active
            message
          }
        }
        value
        step
      }
      assessment
      createdby {
        firstName
        lastName
      }
      patientDetails {
        firstName
        lastName
      }
      browser
      device
      ipAddress
      os
      surveyStartedAt
      timezone
      isSignatureRequired
      signature
      patientMRNumber
      surveyType
      isCompleted
    }
  }
`;
