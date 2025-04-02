import React, { useEffect, useState } from 'react';
import Popover, { PopOverItem } from 'components/Popover';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import Popup from 'reactjs-popup';
import Button from 'components/ui/button/Button';
import LoadingModal from './LoadingModal';
import { useMutation } from '@apollo/client';
import { impersonationToSuperAdmin } from 'graphql/impersonation.mutation';
import {
  ClientListAccounts_pretaaHealthAdminListAccounts,
  PretaaAdminImpersonation,
  PretaaAdminImpersonationVariables,
} from 'health-generatedTypes';
import { toast } from 'react-toastify';
import { ICellRendererParams } from '@ag-grid-community/core';
import { setAuthToken } from 'lib/api/users';
import catchError from 'lib/catch-error';
import { useAppDispatch } from 'lib/store/app-store';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { ImperSonationLocation } from 'interface/authstate.interface';
import messagesData from 'lib/messages';
import { Radio } from '@mantine/core';
import { GridRowDataInterface } from '../ClientManagement';
import { getAppData, setAppData } from 'lib/set-app-data';

interface ClientManagementDetails
  extends ICellRendererParams,
  ClientListAccounts_pretaaHealthAdminListAccounts {}

const EditCellPopOver = (props: ClientManagementDetails) => {
  const data: GridRowDataInterface = props.data;
  const [isActive, setIsActive] = useState(props.data.status || true);
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const refreshToken = localStorage.getItem('refreshToken');
  const dispatch = useAppDispatch();


  useEffect(() => { 
    setIsActive(props.data.status);
  }, [props.data.status]);
  
  const [startImpersonation] = useMutation<PretaaAdminImpersonation, PretaaAdminImpersonationVariables>(impersonationToSuperAdmin, {
    variables: {
      userId: String(props.data.superAdminId),
      refreshToken: String(refreshToken),
    },
    onCompleted: (d) => {
      if (d && d.pretaaHealthAdminImpersonation) {
        toast.success(`Switching to ${data?.name}`);
        const appData = getAppData();
        appData.selectedFacilityId  = [];
        appData.selectedRole = null;
        setAppData(appData);

        setAuthToken({
          token: d.pretaaHealthAdminImpersonation.loginToken as string,
          refreshToken: d.pretaaHealthAdminImpersonation.refreshToken as string,
        });

        dispatch(authSliceActions.startOrStopImpersonation({
          impersonateRequest: ImperSonationLocation.forWard,
        }));
      }
    },
    onError: (e) => catchError(e, true),
  });

  function onEdit(id: string) {
    navigate(routes.owner.editClient.build(id));
  }

  function onView(id: string) {
    navigate(routes.owner.clientDetails.build(id));
  }

  function onViewFacility(id: string) {
    navigate(routes.owner.FacilityManagement.build(id));
  }

  function handleOnClose() {
    setDialogOpen(false);
  }

  function onConfirmReport() {
    setLoadingModal(true);
    setDialogOpen(false);
  }
  function handleSendInvitation (id: string, clientName: string) {
     navigate(routes.owner.sendInvitation.build(id, {
      clientName: clientName
     }));
  }

  function gotoImpersonate() {
    if (props.data.status) {
      startImpersonation();
    } else {
      toast.warning(messagesData.errorList.userInactive);
    }
  }

  return (
    <React.Fragment>
      <div className="flex justify-between">
       
        <Popover>
          <PopOverItem onClick={() => onView(String(data?.id))}>VIEW</PopOverItem>
          {typeof data.facilities === 'number' && data.facilities > 0  && (
           <PopOverItem onClick={() => handleSendInvitation(String(data?.id), String(data?.name))}>Send Invitation</PopOverItem>
          )}
         
          <PopOverItem onClick={() => onViewFacility(String(data?.id))}>VIEW Facilities</PopOverItem>
          <PopOverItem onClick={() => onEdit(String(data?.id))}>EDIT</PopOverItem>
          
          {(isActive && Number(data.facilities) > 0 && data?.superAdminId) && (
            <PopOverItem onClick={() => gotoImpersonate()}>ENTER AS SUPER ADMIN</PopOverItem>
          )}
          </Popover>

        <Popup className="popup-w-auto rounded-xl min-w-300" open={dialogOpen} closeOnDocumentClick onClose={() => handleOnClose()} modal>
          <div className="modal">
            <div className="text-black px-5 pt-5">
              <h2 className="font-bold text-xmd">How would you like your report?</h2>
              <div className="py-4 pt-10">
                {/* Todo */}
                <Radio.Group defaultValue="pdf" name="radio-buttons-group">
                  <Radio value="pdf" label="PDF" />
                  <Radio value="csv" label="CSV" />
                </Radio.Group>
              </div>
            </div>

            <div className="mt-2 p-5 pt-2 flex flex-col sm:flex-row">
              <Button
                text="Request"
                onClick={() => onConfirmReport()}
              />

              <Button classes="sm:ml-2" text="Cancel" buttonStyle="bg-none" onClick={() => handleOnClose()} />
            </div>
          </div>
        </Popup>
        {loadingModal && <LoadingModal modalState={loadingModal} onClose={() => setLoadingModal(false)} />}
      </div>
    </React.Fragment>
  );
};

export default EditCellPopOver;
