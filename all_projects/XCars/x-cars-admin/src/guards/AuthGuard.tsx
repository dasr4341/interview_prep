'use client';
import OfflinePage from '@/components/OfflinePage';
import useCheckConnection from '@/components/useCheckConnection';
import useResetApp from '@/components/useResetApp';
import { config } from '@/config/config';
import { message } from '@/config/message';
import { GET_ACCESS_TOKEN } from '@/graphql/getNewToken.mutation';
import { eventEmitter } from '@/lib/apolloClient';
import { getAppData, setAppData } from '@/lib/appData';
import catchError from '@/lib/catch-error';
import { useMutation } from '@apollo/client';
import { ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const { logout } = useResetApp();
  const { isOffline } = useCheckConnection();

  const [getAccessTokenCallBack] = useMutation(GET_ACCESS_TOKEN, {
    onCompleted: (d) => {
      const { refreshToken, accessToken } = d.getNewTokens;
      setAppData({
        refreshToken,
        token: accessToken,
      });
    },
    onError: (e) => {
      catchError(e);
    },
  });

  useEffect(() => {
    const timeOut = setInterval(() => {
      const refreshToken = getAppData().refreshToken;
      if (refreshToken) {
        getAccessTokenCallBack({
          variables: {
            refreshToken,
          },
        });
      }
    }, 10800000);
    return () => clearInterval(timeOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    eventEmitter.on(config.emitter.tokenIncorrect, () => {
      const appData = getAppData();
      if (appData.token) {
        // navigate to token  expired page
      }
      logout();
    });
    eventEmitter.on(config.emitter.api_server_down, () => {
      toast.error(message.failedToFetch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{isOffline ? <OfflinePage /> : children}</div>;
}
