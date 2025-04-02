import { gql } from '@apollo/client';

export const dataTypeQuery = gql`
  query DataTypes {
    companyTypes
    eventTypes
  }
`;
