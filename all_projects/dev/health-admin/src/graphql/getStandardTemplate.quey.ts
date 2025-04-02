import { gql } from '@apollo/client';

export const getStandardTemplateQuery = gql`
  query GetStandardTemplate($templateId: String!) {
    pretaaHealthAdminGetTemplate(templateId: $templateId) {
      id
      description
      title
      type
      createdAt
      updatedAt
      createdby {
        lastName
        firstName
      }
      surveyTemplateFields {
        id
        questionName
        parentQuestionName
        inputType
        label
        options {
          id
          label
          value
        }
        placeholder
        rangeValue
        step
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
      }
      code
      name
    }
  }
`;
