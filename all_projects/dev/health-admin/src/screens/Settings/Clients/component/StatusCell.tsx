import React, { useEffect, useState } from 'react';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { useMutation } from '@apollo/client';
import {
  AdminUpdateAccountStatus,
  AdminUpdateAccountStatusVariables,
  ClientListAccounts_pretaaHealthAdminListAccounts,
} from 'health-generatedTypes';
import { toast } from 'react-toastify';
import { ICellRendererParams } from '@ag-grid-community/core';
import catchError from 'lib/catch-error';
import { updateAccountStatus } from 'graphql/adminUpdateAccount.mutation';
import { GridRowDataInterface } from '../ClientManagement';

export interface CustomClientList
  extends ICellRendererParams,
  ClientListAccounts_pretaaHealthAdminListAccounts {}


const StatusCell = ({props, updatedRowValue }: {
  props: ICellRendererParams;
  updatedRowValue: React.Dispatch<React.SetStateAction<GridRowDataInterface[]>>;
}) => {
  const [clientDetails, setClientDetails] = useState<ClientListAccounts_pretaaHealthAdminListAccounts | null>(null);
  const [isActive, setIsActive] = useState(props.data.status);

  useEffect(() => {
    if (props.data) {
      setClientDetails(props.data);
    }
    
  }, [props.data]);

  const [statusUpdate, { data: accountStatus }] = useMutation<AdminUpdateAccountStatus, AdminUpdateAccountStatusVariables>(
    updateAccountStatus,
    {
      onCompleted: (d) =>{
        toast.success(`Status is ${d.pretaaHealthAdminUpdateAccountStatus.status ? 'activated' : 'inactivated'} successfully`);
        updatedRowValue((prev) => {
          return prev.map((row) => {
            if (row?.id === props.data?.id) {
              // Update the status in rowData based on the response
              return {
                ...row,
                status: d.pretaaHealthAdminUpdateAccountStatus.status
              }
            }
            return row;
          });
         })
      },
      onError: (e) => catchError(e, true),
    }
  );

  return (
    <React.Fragment>
      <div className="flex justify-between">
        <ToggleSwitch
          checked={
            accountStatus?.pretaaHealthAdminUpdateAccountStatus ? accountStatus.pretaaHealthAdminUpdateAccountStatus.status : isActive
          }
          color="blue"
          onChange={() => {
            statusUpdate({
              variables: {
                accountId: String(clientDetails?.id),
              },
            });
            setIsActive(!isActive);
          }}
        />

      </div>
    </React.Fragment>
  );
};

export default StatusCell;
