import { gql } from '@apollo/client';

export const EventFiltersQuery = gql`
  query EventFilters {
    eventFilters
    eventCompanyTimelineFilters
  }
`;
