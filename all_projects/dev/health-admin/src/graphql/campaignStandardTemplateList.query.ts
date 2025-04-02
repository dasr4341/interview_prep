import { gql } from '@apollo/client';

export const campaignStandardTemplateList = gql`
query GetCampaignStandardTemplates($skip: Int, $take: Int, $searchPhrase: String) {
  pretaaHealthGetCampaignStandardTemplates(skip: $skip, take: $take, searchPhrase: $searchPhrase) {
    id
    status
    name
    description
    topic
    totalCampaignCount
    templateEnableStatus
  }
}
`;