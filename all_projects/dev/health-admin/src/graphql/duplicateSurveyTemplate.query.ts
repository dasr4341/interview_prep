import { gql } from '@apollo/client';

export const duplicateSurveyTemplate = gql`
  mutation DuplicateSurveyTemplate($surveyTemplateId: String!, $title: String) {
    pretaaHealthDuplicateSurveyTemplate(surveyTemplateId: $surveyTemplateId, title: $title)
  }
`;
