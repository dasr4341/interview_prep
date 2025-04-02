import { useMutation } from '@apollo/client';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { toggleGeoFencesMutation } from 'graphql/toggleGeoFencingList.mutation';
import {
  PretaaHealthToggleGeoFenceStatus,
  PretaaHealthToggleGeoFenceStatusVariables
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
interface GeofencesToogleData {
  fenceId: string;
  fenceStatus: boolean;
}

export default function GeofencesToogleSwitch({
  dataProps,
  onSuccess,
  disabled,
  isNotEditable
}: {
  dataProps: GeofencesToogleData;
    onSuccess: () => void;
    disabled?: boolean;
    isNotEditable?: boolean
}) {
  const [checkToggle, setCheckToggle] = useState(dataProps.fenceStatus);
  const [toggleGeoFencingData, { loading: toggleGeoFenceLoading }] = useMutation<
    PretaaHealthToggleGeoFenceStatus,
    PretaaHealthToggleGeoFenceStatusVariables
  >(toggleGeoFencesMutation, {
    onCompleted: () => {
      toast.success(
        `Geofence status ${
          checkToggle === true ? 'activated' : 'inactivated'
        } successfully`
      );
      if (!!onSuccess) {
        onSuccess();
      }
    },
    onError: (e) => catchError(e, true),
  });

  function onHandleChange(fenceId: string) {
      setCheckToggle(!checkToggle);
      toggleGeoFencingData({
        variables: {
          fenceId: fenceId,
        },
      });
 
  }


  return (
    <React.Fragment>
      <ToggleSwitch
        loading={toggleGeoFenceLoading}
        disabled={disabled}
        checked={checkToggle}
        isNotEditable={isNotEditable}
        color={disabled ? 'gray' : 'blue'}
        onChange={() => !toggleGeoFenceLoading && onHandleChange(dataProps.fenceId)}
      />
    </React.Fragment>
  );
}
