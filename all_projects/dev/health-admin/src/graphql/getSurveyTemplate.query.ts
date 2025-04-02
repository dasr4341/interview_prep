import { gql } from '@apollo/client';

export const getSurveyTemplateQuery = gql`
  query GetSurveyTemplate($templateId: String!) {
    pretaaHealthGetTemplate(templateId: $templateId) {
      id
      title
      type
      name
      description
      templateEnableStatus
      surveyTemplateFields {
      parentQuestionName
      questionName
        id
        inputType
        label
        rangeValue
        step
        options {
          id
          label
          value
        }
        placeholder
        validation {
          conditionalValidation
          maxLength {
            active
          }
          minLength {
            active
          }
          patternValidation {
            active
          }
          required {
            active
            message
          }
        }
      }
    }
  }
`;
