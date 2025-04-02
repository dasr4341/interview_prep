import { gql } from '@apollo/client';

export const geoFenceRowRemoveMutation = gql`
  mutation PretaaHealthRemoveGeoFence($fenceId: String!) {
    pretaaHealthRemoveGeoFence(fenceId: $fenceId) {
      id
    }
  }
`;