import { PretaaGetFilteredGroupsVariables, PretaaGetFilteredGroups, SortOrder } from 'generatedTypes';
import { PretaaListGroupQuery } from 'lib/query/groups/list-group';
import { client } from '../../apiClient';

export default function groupsApi() {
  return {
    getGroups: async (query?: PretaaGetFilteredGroupsVariables) => {
      return client.query<PretaaGetFilteredGroups, PretaaGetFilteredGroupsVariables>({
        query: PretaaListGroupQuery,
        variables: {
          ...query,
          orderBy: [
            {
              updatedAt: SortOrder.desc
            }
          ]
        }
      });
    }
  };
}
