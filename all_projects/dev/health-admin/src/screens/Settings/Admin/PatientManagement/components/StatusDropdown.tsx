import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useMutation } from '@apollo/client';
import { updatePatientStatus } from 'graphql/patientStatus.mutation';
import {
  PatientActiveToggle,
  PatientActiveToggleVariables,
  PatientsForAgGrid_pretaaHealthGetPatients,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import { ICellRendererParams } from '@ag-grid-community/core';
import { PatientManagementRow } from '../../PatientLIst/PatientManagement.interface';

export interface CustomPatientType
  extends ICellRendererParams,
    PatientsForAgGrid_pretaaHealthGetPatients {}

export enum StatusType {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive'
}

export default function StatusDropdown({
  props,
  updatedRowsValue
}:{
  props: CustomPatientType
  updatedRowsValue: React.Dispatch<React.SetStateAction<PatientManagementRow[]>>;
}) {
  const data = props.data;
  const [active, setActive] = useState<boolean>(data?.active || false);

  const [updateStatus] = useMutation<
    PatientActiveToggle,
    PatientActiveToggleVariables
  >(updatePatientStatus, {
    onCompleted: (d) => {
      setActive(d.pretaaHealthPatientActiveToggle.active);
      updatedRowsValue((prev) => {
        return prev.map((row) => {
          if (row?.id === data?.id) {
            // Update the status in rowData based on the response
            return {
              ...row,
              active: d.pretaaHealthPatientActiveToggle.active,
              status: d.pretaaHealthPatientActiveToggle.active ? StatusType.ACTIVE : StatusType.INACTIVE
            }
          }
          return row;
        });
       }) 
      toast.success(
        `Status is ${
          d.pretaaHealthPatientActiveToggle.active ? 'activated' : 'inactivated'
        } successfully`
      );
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  return (
    <>
      <div className="flex justify-center">
        <div className="mb-3 xl:w-32 -ml-16 xl:-ml-10">
          <select
            className="form-select appearance-none mr-5 xl:mr-0
            block
            w-full
            px-3
            py-1.5
            
            text-base
            font-normal
            text-gray-700
            bg-white bg-clip-padding bg-no-repeat
            border border-solid border-gray-300
            transition
            ease-in-out
            m-0
            shadow-none
            focus:text-gray-700 focus:bg-white focus:border-gray-300 focus:shadow-none focus:outline-none"
            aria-label="Default select example"
            onChange={() =>
              updateStatus({ variables: { patinetId: String(data.id) } })
            }>
            <option
              value="Active"
              selected={active}>
              Active
            </option>
            <option
              value="Inactive"
              selected={!active}>
              Inactive
            </option>
          </select>
        </div>
      </div>
    </>
  );
}