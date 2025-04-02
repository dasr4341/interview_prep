import { gql } from '@apollo/client';

export const toggleGeoFencesMutation = gql`
  mutation PretaaHealthToggleGeoFenceStatus($fenceId: String!) {
  pretaaHealthToggleGeoFenceStatus(fenceId: $fenceId) {
    status
  }
}
`;
