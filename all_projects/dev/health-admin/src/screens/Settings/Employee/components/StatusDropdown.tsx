import { useMutation } from '@apollo/client';
import { updateEmployeeStatus } from 'graphql/updateEmployeeStatus.mutation';
import {
  EmployeeActiveToggle,
  EmployeeActiveToggleVariables,
  UserStaffTypes,
  UserTypeRole,
} from 'health-generatedTypes';
import catchError from 'lib/catch-error';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { ICellRendererParams } from '@ag-grid-community/core';
import useSelectedRole from 'lib/useSelectedRole';
import { useParams } from 'react-router-dom';
import { PretaaHealthEHRSearchCareTeamsNew } from './EmployeeList/EmployeeList';

export enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export interface CustomUserType extends ICellRendererParams {
  fullName: string | null;
  email: string;
  createdAt: any;
  mobilePhone: string | null;
  lastLoginTime: any | null;
  status: boolean;
  accountId: string;
  id: string;
}

/**
 * Ag Grid Cell Renderer for Status Column
 */
export default function StatusDropdown({
  props,
  updatedRow,
  userStaffType,
}: {
  props: CustomUserType;
  updatedRow: React.Dispatch<React.SetStateAction<PretaaHealthEHRSearchCareTeamsNew[]>>;
  userStaffType: UserStaffTypes;
}) {
  const data = props.data;
  const [active, setActive] = useState<boolean>(data.status || false);

  const isSuperAdmin = useSelectedRole({ roles: [UserTypeRole.SUPER_ADMIN] });
  const isFacilityAdmin = useSelectedRole({ roles: [UserTypeRole.FACILITY_ADMIN] });
  const query: { staffType?: UserTypeRole } = useParams();

  const [updateStatus] = useMutation<EmployeeActiveToggle, EmployeeActiveToggleVariables>(updateEmployeeStatus, {
    onCompleted: (d) => {
      setActive(d.pretaaHealthEmployeeActiveToggle.active);
      updatedRow((prev) => {
        return prev.map((row) => {
          if (row?.id === data?.id) {
            // Update the status in rowData based on the response
            return {
              ...row,
              status: d.pretaaHealthEmployeeActiveToggle.active,
              statusCol: d.pretaaHealthEmployeeActiveToggle.active ? Status.ACTIVE : Status.INACTIVE,
            };
          }
          return row;
        });
      });
      toast.success(
        `Status is ${d.pretaaHealthEmployeeActiveToggle.active ? 'activated' : 'inactivated'} successfully`,
      );
    },
    onError: (e) => {
      catchError(e, true);
    },
  });

  return (
    <React.Fragment>
      {data?.id && (
        <div className="flex">
          {userStaffType !== UserStaffTypes.SUPER_ADMIN && (
            <div className="mb-3 w-28 xl:w-32">
              <select
                disabled={
                  !(
                    (isSuperAdmin || isFacilityAdmin) &&
                    (query.staffType === UserTypeRole.COUNSELLOR || query.staffType === UserTypeRole.FACILITY_ADMIN)
                  )
                }
                className="form-select appearance-none
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
                onChange={() => updateStatus({ variables: { empDetailId: String(data.id) } })}
                value={active ? Status.ACTIVE : Status.INACTIVE}>
                <option value={Status.ACTIVE}>Active</option>
                <option value={Status.INACTIVE}>Inactive</option>
              </select>
            </div>
          )}
          {userStaffType === UserStaffTypes.SUPER_ADMIN && <div>{active ? Status.ACTIVE : Status.INACTIVE}</div>}
        </div>
      )}
    </React.Fragment>
  );
}
