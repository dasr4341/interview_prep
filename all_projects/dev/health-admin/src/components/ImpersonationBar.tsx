import React from 'react';
import { useMutation } from '@apollo/client';
import { impersonateBack } from 'graphql/impersonation.mutation';
import { ImperSonationLocation } from 'interface/authstate.interface';
import { setAuthToken } from 'lib/api/users';
import catchError from 'lib/catch-error';
import { RootState, useAppDispatch } from 'lib/store/app-store';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { useSelector } from 'react-redux';

import Button from './ui/button/Button';
import { getAppData, setAppData } from 'lib/set-app-data';

export default function ImpersonationBar() {
  const user = useSelector((state: RootState) => state.auth.user);
  const impersonate = useSelector((state: RootState) => state.auth.impersonate);
 
  
  const dispatch = useAppDispatch();

  const [stopImpersonation, { loading }] = useMutation<any>(impersonateBack, {
    onCompleted: (d) => {
      if (d) {
        const appData = getAppData();
        appData.selectedFacilityId  = [];
        appData.selectedRole = null;
        setAppData(appData);

        setAuthToken({
          token: d.pretaaHealthBackImpersonation.loginToken as string,
          refreshToken: d.pretaaHealthBackImpersonation.refreshToken as string,
        });
        dispatch(authSliceActions.startOrStopImpersonation({ impersonateRequest: ImperSonationLocation.goBack, }));
      }
    },
    onError: (e) => catchError(e, true),
  });

  return (
    <>
      {(impersonate.length > 0 && user?.pretaaHealthCurrentUser.id) && (
          <div
            className="bg-pt-yellow-500 py-1 px-5 lg:px-16 lg:sticky top-9 lg:top-0 left-0
         w-full flex justify-between items-center text-sm z-30 gap-3">
            <div className="italic">
              Now viewing as {user.pretaaHealthCurrentUser.firstName} {user.pretaaHealthCurrentUser.lastName}
            </div>
            <Button
              size="xs"
              buttonStyle='blue'
            onClick={() => !loading && stopImpersonation()}>
              Go Back
            </Button>
          </div>
        )}
    </>
  );
}
