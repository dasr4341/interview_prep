import { gql } from '@apollo/client';

export const createStandardTemplateMutation = gql`
  mutation CreateStandardTemplate(
    $fields: [SurveyTemplateFieldCreateAdminArgs!]!
    $title: String!
    $description: String
    $code: String
    $name: String
  ) {
    pretaaHealthAdminCreateSurveyTemplate(
      surveyTemplateFields: $fields
      title: $title
      description: $description
      code: $code
      name: $name
    )
  }
`;
