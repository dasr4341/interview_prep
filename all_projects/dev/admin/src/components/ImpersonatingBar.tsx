import { client } from 'apiClient';
import { config } from 'config';
import { StopImpersonation } from 'generatedTypes';
import { setAuthToken } from 'lib/api/users';
import catchError from 'lib/catch-error';
import { stopImpersonation } from 'lib/mutation/auth/stop-impersination';
import { RootState } from 'lib/store/app-store';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { controlPanelSlice } from 'lib/store/slice/control-panel';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from 'routes';
import Button from './ui/button/Button';

export default function ImpersonatingBar() {
  const [showButton, setShowButton] = useState<boolean>();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  async function stopImpersonations() {
    try {
      const response = await client.mutate<StopImpersonation>({ mutation: stopImpersonation });
      localStorage.removeItem(config.storage.user_store);
      localStorage.removeItem(config.storage.impersonation_mode);

      if (response.data?.pretaaStopImpersonation) {
        dispatch(controlPanelSlice.actions.updateSwitching(true));

        setAuthToken({
          token: response.data?.pretaaStopImpersonation.loginToken,
          refreshToken: response.data?.pretaaStopImpersonation.refreshToken,
        });

        dispatch(authSliceActions.getCurrentSuperAdmin());

        setTimeout(() => {
          window.location.href = routes.controlPanelScreen.match;
        }, 3000);
      }
    } catch (e) {
      catchError(e, true);
    }
  }

  useEffect(() => {
    if (localStorage.getItem(config.storage.impersonation_mode)) {
      setShowButton(true);
    }
  }, []);

  return (
    <>
      {showButton && user && (
        <div className="bg-pt-yellow-500 py-1 px-6 lg:px-16 sticky top-9 lg:top-0 left-0
         w-full flex justify-between items-center text-xs z-30">
          <div className="italic">Now viewing as {user.currentUser.firstName} {user.currentUser.lastName}</div>
          <Button size='xs' classes={['px-3']} onClick={() => stopImpersonations()}>Go Back</Button>
        </div>
      )}
    </>
  );
}
