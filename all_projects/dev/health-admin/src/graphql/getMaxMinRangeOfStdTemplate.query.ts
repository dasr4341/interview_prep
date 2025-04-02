import { gql } from '@apollo/client';

export const GetMaxMinRangeOfStdTemplateQuery = gql`
  query GetMaxMinRangeOfStdTemplate($surveyAssignId: String!) {
    pretaaHealthGetMaxMinRangeOfStdTemplate(surveyAssignId: $surveyAssignId) {
      code
      chartTopLeftScale {
        min
        max
      }
      chartTopRightScale {
        min
        max
      }
      chartBotomLeftScale {
        min
        max
      }
      chartBotomRightScale {
        min
        max
      }
    }
  }
`;
