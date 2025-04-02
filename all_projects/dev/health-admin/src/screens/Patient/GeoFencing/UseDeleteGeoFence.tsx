import { useMutation } from '@apollo/client';

import { PretaaHealthRemoveGeoFenceVariables, PretaaHealthRemoveGeoFence_pretaaHealthRemoveGeoFence } from 'health-generatedTypes';
import { geoFenceRowRemoveMutation } from 'graphql/geoFencingRowRemove.mutation';
import catchError from 'lib/catch-error';

export default function UseDeleteGeoFence({ onCompleted }: { onCompleted: () => void; }) {
  const [removeGeoFenceData, { loading: fenceDeleteProgress }] = useMutation<
    PretaaHealthRemoveGeoFence_pretaaHealthRemoveGeoFence,
    PretaaHealthRemoveGeoFenceVariables
  >(geoFenceRowRemoveMutation, {
    onCompleted,
    onError: (e) => catchError(e, true),
  });

  return {
    removeGeoFenceData,
    fenceDeleteProgress,
  };
}
