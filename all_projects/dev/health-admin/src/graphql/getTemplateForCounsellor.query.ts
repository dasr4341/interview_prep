import { gql } from '@apollo/client';

export const getTemplateForCounsellor = gql`
   query TemplateForCounsellors(
    $type: SurveyTemplateTypes!
    $take: Int
    $skip: Int
    $searchPhrase: String
  ) {
    pretaaHealthTemplatesForCounsellors(
      type: $type
      take: $take
      skip: $skip
      searchPhrase: $searchPhrase
    ) {
      name
      topic
      totalCampaignCount
      title
      id
      description
      facilityName
    }
  }
`;
