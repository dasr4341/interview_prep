import { gql } from '@apollo/client';

export const appDataQuery = gql`
  query AppData {
    pretaaHealthReminderTypes
  }
`;
