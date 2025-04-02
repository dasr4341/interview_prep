'use client';
import { config } from '@/config/config';
import { eventEmitter } from '@/lib/apolloClient';
import { getAppData, setAppData } from '@/lib/appData';
import catchError from '@/lib/catch-error';
import { useMutation } from '@apollo/client';
import { ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';
import useLogout from '../components/hooks/Logout';
import { GET_ACCESS_TOKEN } from '../graphql/getNewToken.mutation';
import { messageGenerators } from '../config/messages';

export default function AuthGuard({ children }: { children: ReactNode }) {
  const logout = useLogout();

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
    }, 100000);
    return () => clearInterval(timeOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    eventEmitter.on(config.emitter.tokenIncorrect, () => {
      logout();
    });
    eventEmitter.on(config.emitter.api_server_down, () => {
      toast.error(messageGenerators.failedToFetch);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{children}</div>;
}
