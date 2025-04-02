import React, { useState } from 'react';
import { ICellRendererParams } from '@ag-grid-community/core';
import { useMutation } from '@apollo/client';
import Popover, { PopOverItem } from './PopOver';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import ReportPopover from './ReportPopOver';
import { PretaaAdminUpdateCustomer } from 'lib/mutation/super-user/update-customer';
import {
  PretaaAdminUpdateCustomer as IPretaaAdminUpdateCustomer,
  PretaaAdminUpdateCustomerVariables,
  StartImpersonation,
  StartImpersonationVariables
} from 'generatedTypes';
import catchError from 'lib/catch-error';
import { client } from 'apiClient';
import { startImpersonation } from 'lib/mutation/auth/start-impersination';
import { useDispatch } from 'react-redux';
import { controlPanelActions, controlPanelSlice } from 'lib/store/slice/control-panel';
import { routes } from 'routes';
import { config } from 'config';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { setAuthToken } from 'lib/api/users';

const StatusCell = ({
  value,
  data,
}: ICellRendererParams) => {
  const dispatch = useDispatch();
  const [isActive, setIsActive] = useState(value);
  const [Open, setOpen] = useState(false);
  const [
    updateCustomerStatus,
    { loading },
  ] = useMutation<IPretaaAdminUpdateCustomer, PretaaAdminUpdateCustomerVariables>(PretaaAdminUpdateCustomer);

  async function viewCustomer(d: any) {
    try {
      const response = await client.mutate<StartImpersonation, StartImpersonationVariables>({ 
        mutation: startImpersonation,
        variables: {
          customerId: d.id
        }
      });
      console.log(response);
      if (response.data?.pretaaAdminImpersonateUser) {
        localStorage.setItem(config.storage.impersonation_mode, 'true');
        dispatch(controlPanelSlice.actions.updateSwitching(true));

        setAuthToken({ 
          token: response.data?.pretaaAdminImpersonateUser.loginToken as string,
          refreshToken: response.data?.pretaaAdminImpersonateUser.refreshToken as string
        });
        localStorage.removeItem(config.storage.admin_store);
        dispatch(authSliceActions.getCurrentUser());
        setTimeout(() => {
          window.location.href = routes.events.match;
        }, 3000);
      }
    } catch (e) {
      catchError(e, true);
    }
    
  }

  function exportReport(id: number) {
    setOpen(true);
    console.log(id);
    dispatch(controlPanelActions.updateClientId(id));
  }

  return (
    <>
      <div
        className="items-center
          border-gray-500 relative accordion-button flex mt-0.5">
        <ToggleSwitch
        checked={isActive}
          color="blue"
          onChange={async (checked) => {
            if (loading) return;
            setIsActive(checked);
            try {
              await updateCustomerStatus({
                variables: {
                  customerId: data.id,
                  status: checked,
                }
              });
            } catch (error) {
              catchError(error);
              // Fallback to old value as some error occurred.
              setIsActive(!checked);
            }
          }}
        />
      </div>
      <div
        className="md:inset-y-1/2 left-0 mb-2 md:transform md:rotate-90 md:flex items-center p-3 ml-8
         relative md:static">
        <Popover>
          <PopOverItem onClick={() => viewCustomer(data)}>
            VIEW
          </PopOverItem>
          <PopOverItem onClick={() => exportReport(data.id)}>GENERATE USAGE REPORT</PopOverItem>
        </Popover>
        {Open && <ReportPopover open={Open} setOpen={setOpen} />}
      </div>
    </>
  );
};

export default StatusCell;
