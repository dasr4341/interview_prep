import { gql } from '@apollo/client';

export const userImport = gql`
  mutation UserImport($file: Upload!) {
    pretaaCsvUserImport(file: $file)
  }
`;
