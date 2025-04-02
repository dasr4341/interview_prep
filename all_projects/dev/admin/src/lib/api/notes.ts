import { client } from 'apiClient';
import {
  GetFilteredNotes,
  GetFilteredNotesVariables,
  GetNotes,
  GetNotesVariables,
  GetNotes_pretaaGetUserNotes,
  PretaaGetOpprtunityNotes,
  PretaaGetOpprtunityNotesVariables,
  PretaaGetOpprtunityNotes_pretaaGetOpprtunityNotes,
} from 'generatedTypes';
import catchError from 'lib/catch-error';
import { getNotes } from 'lib/query/notes/get-notes';
import { GetFilteredNotesQuery } from 'lib/query/notes/get-public-notes';
import { GET_OPPORTUNITY_NOTES_QUERY } from 'lib/query/opportunity/get-opportunity-notes';

const notesApi = {
  getNotes: async (query: PretaaGetOpprtunityNotesVariables) => {
    const { data } = await client.query<PretaaGetOpprtunityNotes, PretaaGetOpprtunityNotesVariables>({
      query: GET_OPPORTUNITY_NOTES_QUERY,
      variables: query,
    });

    if (data.pretaaGetOpprtunityNotes) {
      return data.pretaaGetOpprtunityNotes;
    } else {
      return [];
    }
  },
  getFilteredNotes: async (query: GetFilteredNotesVariables) => {
    const { data } = await client.query<GetFilteredNotes, GetFilteredNotesVariables>({
      query: GetFilteredNotesQuery,
      variables: query,
    });

    if (data.pretaaGetFilteredNotes) {
      return data.pretaaGetFilteredNotes;
    } else {
      return [];
    }
  },
  getPrivateNotes: async (query: GetNotesVariables) => {
    const { data } = await client.query<GetNotes, GetNotesVariables>({
      query: getNotes,
      variables: query,
    });

    if (data.pretaaGetUserNotes) {
      return data.pretaaGetUserNotes;
    } else {
      return [];
    }
  },
  getNotesScreenData: async ({ opportunityId }: { opportunityId?: string }, queryVariables: GetNotesVariables) => {
    try {
      let data: GetNotes_pretaaGetUserNotes[] | PretaaGetOpprtunityNotes_pretaaGetOpprtunityNotes[] = [];
      if (opportunityId) {
        delete queryVariables.companyId;
        delete queryVariables.eventId;

        data = await notesApi.getNotes({
          ...queryVariables,
          opportunityId: opportunityId,
        });
      } else if (location.pathname.includes('companies')) {
        data = await notesApi.getFilteredNotes({
          ...queryVariables,
          filterList: [],
        });
      } else {
        data = await notesApi.getPrivateNotes(queryVariables);
      }
      return data;
    } catch (e) {
      catchError(e);
      return [];
    }
  },
};

export default notesApi;
