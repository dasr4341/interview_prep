import { gql } from '@apollo/client';

export const updateSurveyTemplateMutation = gql`
  mutation UpdateSurveyTemplate(
    $surveyTemplateFields: [SurveyTemplateFieldCreateArgs!]!
    $templateId: String!
    $title: String!
    $description: String
    $name: String
  ) {
    pretaaHealthUpdateSurveyTemplate(
      surveyTemplateFields: $surveyTemplateFields
      templateId: $templateId
      title: $title
      description: $description
      name: $name
    )
  }
`;
