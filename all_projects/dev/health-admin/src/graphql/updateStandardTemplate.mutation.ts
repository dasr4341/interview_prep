import { gql } from '@apollo/client';

export const updateStandardTemplateMutation = gql`
  mutation UpdateStandardTemplate(
    $fields: [SurveyTemplateFieldCreateAdminArgs!]!
    $title: String!
    $description: String
    $templateId: String!
    $name: String
    $code: String
  ) {
    pretaaHealthAdminUpdateSurveyTemplate(
      surveyTemplateFields: $fields
      title: $title
      description: $description
      templateId: $templateId
      name: $name
      code: $code
    )
  }
`;
