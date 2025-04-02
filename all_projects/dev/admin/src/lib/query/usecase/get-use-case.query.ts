import { gql } from '@apollo/client';

export const GetUseCaseSchemaQuery = gql`
  query GetUseCaseSchema {
    pretaaGetUseCases {
      id
      name
    }
  }
`;
