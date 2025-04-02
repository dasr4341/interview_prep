import {
  QueryVariables,
  UrlQuery,
  UrlQueryOptions,
} from 'interface/url-query.interface';
import queryString from 'query-string';

export function buildQueryURL({
  options,
  phrase,
  prevQuery,
  companyId,
  eventId,
  filterRange,
  reference
}: UrlQuery): string {
  const query = {
    ...prevQuery
  };

  if (prevQuery && !options && prevQuery.options) {
    options = prevQuery.options;
  }

  if (options && Array.isArray(options)) {
    const checkedItems = options.filter((o) => o.checked);
    const optString = JSON.stringify(checkedItems);
    query.options = optString as unknown as UrlQueryOptions[];
  }

  if (options && !Array.isArray(options) && Object.keys(options).length > 0) {
    const optionData = JSON.stringify(options);
    query.options =  optionData as unknown as UrlQueryOptions[];
  }
  
  if (phrase || phrase == '') {
    query.phrase = phrase;
  }

  if (reference) {
    query.reference = reference;
  }
  
  if (filterRange) {
    query.filterRange = filterRange;
  } else if (filterRange === null) { //for remove filterRange from url
    delete query.filterRange;
  }

  if (companyId)
    query.companyId = companyId;

  if (eventId)
    query.eventId = eventId;

  const uri = queryString.stringify(query);
  return uri;
}

export function parseQueryURL(query: string): UrlQuery {
  const parsed = queryString.parse(query);
  const options$ = parsed.options;
  const options: UrlQueryOptions[] = options$
    ? JSON.parse(options$ as string)
    : [];

  return {
    ...parsed,
    options,
  };
}

export default function createQueryVariables(
  query: UrlQuery
): QueryVariables {

  let selectedOptions: Array<string> = [];
  if (query && query.options && Array.isArray(query.options)) {
    selectedOptions = query.options
      .filter((o) => o.checked)
      .map((o) => o.value) as string[];
  }

  let queryVar: QueryVariables = {
    selectedOptions,
    skip: query.skip ? query.skip : 0,
    phrase: query.phrase ? query.phrase : '',
  };
  if (query.filterRange) {
    queryVar.filterRange = query.filterRange;
  }
  if (query.eventId) {
    queryVar =  {
      ...queryVar,
      eventId: query.eventId
    };
  }
  if (query.opportunityId) {
    queryVar =  {
      ...queryVar,
      opportunityId: query?.opportunityId
    };
  }
  if (query.companyId) {
    queryVar =  {
      ...queryVar,
      companyId: query.companyId 
    };
  }
  return queryVar as QueryVariables;
}
