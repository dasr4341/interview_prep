import {
  GetLaunches, GetLaunchesVariables, PretaaGetOpportunityLaunches, PretaaGetOpportunityLaunchesVariables
} from 'generatedTypes';
import { GetLaunchesQuery } from 'lib/query/launch/get-launches';
import { GET_OPPORTUNITY_LAUNCHES_QUERY } from 'lib/query/opportunity/get-opportunity-launches';
import { client } from '../../apiClient';

export default function launchesApi() {
  return {
    getLaunches: async (query: GetLaunchesVariables) => {
      return client.query<GetLaunches, GetLaunchesVariables>({
        query: GetLaunchesQuery,
        variables: query
      });
    },
    getOpportunityLaunches: async (query: PretaaGetOpportunityLaunchesVariables) => {
      return client.query<PretaaGetOpportunityLaunches, PretaaGetOpportunityLaunchesVariables>({
        query: GET_OPPORTUNITY_LAUNCHES_QUERY,
        variables: query
      });
    },
  };
}