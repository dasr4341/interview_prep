import { client } from '../../apiClient';
import { GetTicketsQuery } from 'lib/query/tickets/get-tickets';
import { GetTickets, GetTicketsVariables } from 'generatedTypes';

export default function ticketsApi() {
  return {
    getTickets: async (query: GetTicketsVariables) => {
      return client.query<GetTickets, GetTicketsVariables>({
        query: GetTicketsQuery,
        variables: query
      });
    },
  };
}