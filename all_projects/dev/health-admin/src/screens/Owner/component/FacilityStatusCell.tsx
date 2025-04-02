import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ApolloError, useMutation } from '@apollo/client';

import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import catchError from 'lib/catch-error';
import { ICellRendererParams } from '@ag-grid-community/core';
import { FacilityUsersInterface } from '../SourceSystem/lib/FacilityFormHelper';
import { adminFacilityStatus } from 'graphql/facility-status.mutation';
import { PretaaHealthAdminFacilityStatus, PretaaHealthAdminFacilityStatusVariables } from 'health-generatedTypes';

export interface CustomFacilityList extends ICellRendererParams, FacilityUsersInterface {}

export default function FacilityStatusCell({ props, updatedRowValue }: {
  props: CustomFacilityList;
  updatedRowValue: React.Dispatch<React.SetStateAction<FacilityUsersInterface[] | null>>;
}) {
  const [checked, setChecked] = useState(props.data.status);
  const [updateStatus] = useMutation<PretaaHealthAdminFacilityStatus, PretaaHealthAdminFacilityStatusVariables>(adminFacilityStatus);

  function setStatus(v: boolean) {
    setChecked(!checked);
    updateStatus({
      variables: {
        facilityId: props.data.id,
        facilityStatus: v,
      },
      onCompleted: (d) => {
        toast.success(`Status is ${d.pretaaHealthAdminFacilityStatus.isActive ? 'activated' : 'inactivated'} successfully`);
        updatedRowValue((prev) => {
          return prev?.map((row) => {
            if (row?.id === props.data?.id) {
              // Update the status in rowData based on the response
              return {
                ...row,
                status: d.pretaaHealthAdminFacilityStatus.isActive
              }
            }
            return row;
          }) as FacilityUsersInterface[];
         })
      }, 
      onError: (e: ApolloError) => {
        catchError(e, true);
      },
    });
  }

  return (
    <React.Fragment>
      <div className="items-center border-gray-500 relative accordion-button flex">
        <ToggleSwitch checked={checked} color={'blue'} onChange={(v) => setStatus(v)} />
      </div>
    </React.Fragment>
  );
}
