import React from 'react';
import Popover, { PopOverItem } from 'components/Popover';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import {
  ImpersonateFacilityUser,
  ImpersonateFacilityUserVariables,
  UserStaffTypes,
  UserTypeRole,
} from 'health-generatedTypes';
import { impersonateToCounselor } from 'graphql/impersonation.mutation';
import { toast } from 'react-toastify';
import { setAuthToken } from 'lib/api/users';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { ImperSonationLocation } from 'interface/authstate.interface';
import catchError from 'lib/catch-error';
import { ICellRendererParams } from '@ag-grid-community/core';
import { useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { ImSpinner7 } from 'react-icons/im';
import { DeletePatientOrStaffStateInterfaceByFacilityAdmin } from 'screens/Settings/interface/DeletePatientOrStaffStateInterfaceByFacilityAdmin';
import useSelectedRole from 'lib/useSelectedRole';
import messagesData from 'lib/messages';

export interface EditCellPopOverDeleteStaffInterface {
  deleteStaffState: DeletePatientOrStaffStateInterfaceByFacilityAdmin,
  setDeleteStaffState: React.Dispatch<React.SetStateAction<DeletePatientOrStaffStateInterfaceByFacilityAdmin>>,
  loading: boolean
}
export default function EditCellPopOver({
  rowData,
  deleteStaff,
  userStaffType
}: {
  rowData: ICellRendererParams;
  deleteStaff: EditCellPopOverDeleteStaffInterface;
  userStaffType: UserStaffTypes
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query: { staffType?: UserTypeRole } = useParams();
  const isSuperAdmin = useSelectedRole({ roles : [UserTypeRole.SUPER_ADMIN] });
  const isFacilityAdmin = useSelectedRole({ roles : [UserTypeRole.FACILITY_ADMIN ] });


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startImpersonation] = useMutation<ImpersonateFacilityUser, ImpersonateFacilityUserVariables>(
    impersonateToCounselor,
    {
      variables: {
        pretaaHealthImpersonationId: String(rowData.data.userId),
        token: String(localStorage.getItem('refreshToken')),
      },
      onCompleted: (d) => {
        if (d && d.pretaaHealthImpersonation) {
          toast.success(`Switching to ${rowData.data.name || ''}`);
          setAuthToken({
            token: d.pretaaHealthImpersonation.loginToken as string,
            refreshToken: d.pretaaHealthImpersonation.refreshToken as string,
          });
          dispatch(
            authSliceActions.startOrStopImpersonation({
              impersonateRequest: ImperSonationLocation.forWard,
            })
          );
        }
      },
      onError: (e) => catchError(e, true),
    }
  );

  return (
    <div className="flex justify-between items-center">
      {(isSuperAdmin || isFacilityAdmin) &&
        (query.staffType === UserTypeRole.COUNSELLOR || query.staffType === UserTypeRole.FACILITY_ADMIN) && (
          <Popover>
            <PopOverItem onClick={() => navigate(routes.admin.employeeDetailsScreen.build(String(rowData.data.id)))}>
              View
            </PopOverItem>
            {(userStaffType !== UserStaffTypes.FACILITY_ADMIN || isSuperAdmin)  && (
              <PopOverItem onClick={() => navigate(routes.admin.careTeam.edit.build(String(rowData.data.id)))}>
                Edit
              </PopOverItem>
            )}

            <PopOverItem
              className="hidden"
              onClick={() =>
                rowData.data.status ? startImpersonation() : toast.warning(messagesData.errorList.userInactive)
              }>
              Switch user
            </PopOverItem>
            <PopOverItem
              onClick={() => {
                if (deleteStaff.loading) {
                  return;
                }
                deleteStaff.setDeleteStaffState(() => ({
                  modalState: true,
                  selectedPatient: [rowData.data.id],
                }));
              }}>
              <div className=" flex flex-row items-center">
                Delete
                {deleteStaff.deleteStaffState?.selectedPatient?.includes(rowData.data.id) && deleteStaff.loading ? (
                  <ImSpinner7 className="animate-spin ml-2" />
                ) : (
                  ''
                )}
              </div>
            </PopOverItem>
          </Popover>
        )}
    </div>
  );
}
