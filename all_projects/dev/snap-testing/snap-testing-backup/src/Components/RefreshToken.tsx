import { config } from 'config';
import { differenceInMinutes } from 'date-fns';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
import { setAuthToken } from 'Lib/HelperFunction/setAuthToken';
import React, { useEffect } from 'react';

export default function RefreshToken() {

  useEffect(() => {
    setInterval(async () => {
      const loginTime = localStorage.getItem(config.storage.loginTime);
      const refreshToken = localStorage.getItem(config.storage.refreshToken);
      if (refreshToken && loginTime) {
        const logTime = JSON.parse(loginTime);
        if (differenceInMinutes(new Date(), new Date(logTime)) > 4) {

          try {
            const { data } = await snapActionsApi.refreshToken(refreshToken);
            setAuthToken(data.access, data.refresh);
          } catch (e: any) {
            console.error('Unable to update token', e.message);
          }
        }
      }
    }, 1000 * 60);
  }, []);

  return (
    <></>
  );
}
