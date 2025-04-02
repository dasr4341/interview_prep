import { gql } from '@apollo/client';

export const surveyTemplateListQuery = gql`
query PretaaHealthGetTemplates(
  $type: SurveyTemplateTypes
  $skip: Int
  $take: Int
  $searchPhrase: String
) {
  pretaaHealthGetTemplates(
    type: $type
    skip: $skip
    take: $take
    searchPhrase: $searchPhrase
  ) {
    id
    title
    name
    type
    description
    totalCampaignCount
    topic
    templateEnableStatus
    facilityName
  }
}
`;