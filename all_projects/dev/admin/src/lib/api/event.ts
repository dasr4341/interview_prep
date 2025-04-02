import {
  GetEvent,
  GetCompanyFilteredEvents,
  GetCompanyFilteredEvents_getCompanyFilteredEvents,
  GetEvents,
  EventFilters,
  GetEvents_getFilteredEvents,
  EventToggleFlag,
  EventMarkAsRead,
  HideUserEventMutation,
  EventAttention,
  GetEventVariables,
  EventToggleFlagVariables,
  HideUserEventMutationVariables,
  EventMarkAsReadVariables,
  GetEventsVariables,
} from 'generatedTypes';
import { UrlQueryOptions } from 'interface/url-query.interface';
import { EventsQuery } from 'lib/query/events/event-filter';
import { EventFiltersQuery } from 'lib/query/events/event-filters';
import { GetCompanyFilteredEventsQuery } from 'lib/query/company/get-company-filtered-events';
import { EventMarkAsReadMutation } from 'lib/query/events/event-mark-as-read';
import { EventToggleFlagMutation } from 'lib/query/events/event-toggle-flag';
import { GetEventQuery } from 'lib/query/events/get-event';
import { hideUserEventMutation } from 'lib/mutation/events/event-hide-at';
import { client } from '../../apiClient';

export function eventApi() {
  return {
    getEventFilter: async (id?: string): Promise<UrlQueryOptions[]> => {
      const { data }: { data: EventFilters } = await client.query({
        query: EventFiltersQuery,
      });

      const options: any = [];
      const filters = id ? data.eventCompanyTimelineFilters : data.eventFilters;
      Object.keys(filters).forEach((key) => {
        if (key === 'messages') {
          let nestedArr: Array<any> = [
            {
              label: key,
              value: key,
              section: true,
            },
          ];
          const list: Array<any> = Object.keys(data.eventFilters[key]).map((nestedKey) => {
            return {
              value: `${nestedKey}`,
              label: data.eventFilters[key][nestedKey],
            };
          });
          list.push({
            label: '',
            value: '',
            section: true,
          });
          nestedArr = nestedArr.concat(list);
          options.push(...nestedArr);
        } else {
          options.push({
            label: data.eventFilters[key],
            value: key,
          });
        }
      });

      return options;
    },
    getEvents: async (query?: GetEventsVariables): Promise<GetEvents_getFilteredEvents[]> => {
      const { data }: { data: GetEvents } = await client.query({
        query: EventsQuery,
        variables: query ? query : {},
      });

      return data.getFilteredEvents;
    },

    getCompanyEvents: async (
      query?: GetEventsVariables
    ): Promise<GetCompanyFilteredEvents_getCompanyFilteredEvents[]> => {
      const { data }: { data: GetCompanyFilteredEvents } = await client.query({
        query: GetCompanyFilteredEventsQuery,
        variables: query ? query : {},
      });

      return data.getCompanyFilteredEvents;
    },

    getEvent: async (query: GetEventVariables): Promise<GetEvent> => {
      const { data } = await client.mutate<GetEvent, GetEventVariables>({
        mutation: GetEventQuery,
        variables: query,
      });

      return data as unknown as GetEvent;
    },

    updateReadAtEvent: async (query: EventMarkAsReadVariables) => {
      const { data } = await client.mutate<EventMarkAsRead, EventMarkAsReadVariables>({
        mutation: EventMarkAsReadMutation,
        variables: query,
      });

      return data?.updateReadAtEvent.userEvents;
    },
    toggleFlagEvent: async (query: EventToggleFlagVariables) => {
      const { data } = await client.mutate<EventToggleFlag, EventToggleFlagVariables>({
        mutation: EventToggleFlagMutation,
        variables: query,
      });

      return data;
    },
    updateHideAtEvent: async (query: HideUserEventMutationVariables) => {
      const { data } = await client.mutate<HideUserEventMutation, HideUserEventMutationVariables>({
        mutation: hideUserEventMutation,
        variables: query,
      });

      return data?.hideUserEvent.userEvents;
    },
    // !Logics comes from discussion: https://imgur.com/zkQ7bhO
    isFlagged: (eventAttention: EventAttention | null | undefined, flaggedAt: number | null | undefined): boolean => {
      if (
        // col 2
        (eventAttention === null && flaggedAt === 1) ||
        // col 3
        (eventAttention === EventAttention.NEEDS_ATTENTION && (flaggedAt === undefined || flaggedAt === 0)) ||
        // col 4
        (eventAttention === EventAttention.NEEDS_ATTENTION && flaggedAt === 1)
      ) {
        return true;
      } else if (
        // col 1
        (eventAttention === null && (flaggedAt === 0 || flaggedAt === 2)) ||
        // col 5
        (eventAttention === EventAttention.NEEDS_ATTENTION && flaggedAt === 2)
      ) {
        return false;
      } else {
        // This is edge case, and not documented
        return false;
      }
    },
  };
}
