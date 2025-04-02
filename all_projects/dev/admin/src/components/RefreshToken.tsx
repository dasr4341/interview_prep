/* eslint-disable react-hooks/exhaustive-deps */
import { config } from 'config';
import restApi from 'lib/rest-client';
import { RootState } from 'lib/store/app-store';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import moment from 'moment';
import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function RefreshToken() {
  const dispatch = useDispatch();
  const admin = useSelector((state: RootState) => state.auth.admin);
  const user = useSelector((state: RootState) => state.auth.user);


  const getToken = () => {
    return localStorage.getItem('token');
  };

  const [token, setToken] = useState<string | null>(getToken());

  
  useEffect(() => {
    const isAdmin = localStorage.getItem(config.storage.admin_store);

    window.onload = () => {
      if (!token) {
        setToken(null);
      } else {
        if (isAdmin) {
          dispatch(authSliceActions.getCurrentSuperAdmin());
        } else {
          dispatch(authSliceActions.getCurrentUser());
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window]);

  function updateToken(longinToken: string, refreshToken: string) {
    localStorage.setItem(config.storage.token, longinToken);
    localStorage.setItem(config.storage.refreshToken, refreshToken);
    localStorage.setItem(config.storage.loginTime, JSON.stringify(moment().format('HH:mm')));
  }
  
  useEffect(() => {
    const interval = 1000 * 60 * 5; // 5 min

    setInterval(async () => {
      const tokenObj: any = localStorage.getItem(config.storage.refreshToken);
      const timeObj: any = localStorage.getItem(config.storage.loginTime);

      if (tokenObj && timeObj) {
        const startTime = moment(String(timeObj), 'hh:mm:ss a');
        const currentTime = moment(String(moment().format('HH:mm')), 'hh:mm:ss a');
        const totalH = currentTime.diff(startTime, 'hours');

        if (totalH) {
          try {
            if (admin) {
              const data = await restApi.regenerateAdminTokens({ refreshToken: tokenObj });
              if (data.data) {
                updateToken(data.data.loginToken, data.data.refreshToken);
              }
            } else if (user) {
              const data = await restApi.regenerateTokens({ refreshToken: tokenObj });
              if (data.data) {
                updateToken(data.data.loginToken, data.data.refreshToken);
              }
            }
          } catch (e: any) {
            console.error('Unable to update token', e.message);
          }
        }
      }
    }, interval);
  }, []);

  return (
    <div>

    </div>
  );
  
}
