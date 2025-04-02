import queryString from 'query-string';

export function getSearchedPhaseQuery(query: string) {
  if (query) {
    return queryString.parse(query).searchedPhase as string;
  }
  return '';
}