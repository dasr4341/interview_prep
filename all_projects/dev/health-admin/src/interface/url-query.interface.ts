export interface UrlQueryOptions {
  label: string;
  value: string;
  checked?: boolean;
  section?: boolean;
}

export interface FilterRangeVariable {
  label: string,
  value: string
}

export interface TicketsFilterOptions {
  label: string;
  value: string;
  type?: string;
  checked: boolean;
  section?: boolean;
}

export interface DateDataInterface {
  startDate: string;
  endDate: string;
}
export interface DaysOpenInterface {
  from: string;
  to: string;
}

export interface UrlQuery {
  opportunityId?: string;
  options?: UrlQueryOptions[];
  phrase?: string;
  prevQuery?: UrlQuery;
  take?: number;
  skip?: number;
  order?: 'createdAt' | 'name';
  orderBy?: 'ASC' | 'DESC';
  companyId?: string;
  eventId?: string;
  // filterRange?: DateRangeTypes | null,
  filterRange?: any,
  reference?: boolean,
  timeline?: boolean;
}

export interface QueryVariables {
  skip: number;
  take?: number;
  phrase?: string,
  selectedOptions: Array<string>;
  order?: 'createdAt' | 'name';
  orderBy?: 'ASC' | 'DESC';
  companyId?: string;
  eventId?: string;
  // filterRange?: DateRangeTypes,
  filterRange?: any,
  opportunityId?: string;
}