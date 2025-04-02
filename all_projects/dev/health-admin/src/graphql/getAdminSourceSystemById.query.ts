import { gql } from '@apollo/client';

export const getSourceSystemById = gql`
  query AdminGetSourceSystemById($sourceSystemId: String!) {
    pretaaHealthAdminGetSourceSystemById(sourceSystemId: $sourceSystemId) {
      id
      name
      slug
      createdAt
      staticFields {
        facilityName
        timezone
      }
    }
  } 
`;