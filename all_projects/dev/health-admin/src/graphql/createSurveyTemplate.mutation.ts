import { gql } from '@apollo/client';

export const createSurveyTemplateMutation = gql`
  mutation CreateSurveyTemplate(
  $surveyTemplateFields: [SurveyTemplateFieldCreateArgs!]!
  $description: String
  $name: String
  $title: String!
  $facilityId: String
) {
  pretaaHealthCreateSurveyTemplate(
    surveyTemplateFields: $surveyTemplateFields
    description: $description
    name: $name
    title: $title
    facilityId: $facilityId
  )
}
`;
