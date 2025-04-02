/*  */
import { config } from '../config';
import { useEffect } from 'react';
import { regenerateOwnerToken, regenerateToken } from 'graphql/regenerate-token';
import { RegenerateOwnerToken, RegenerateOwnerTokenVariables, RegenerateToken, RegenerateTokenVariables } from 'health-generatedTypes';
import { differenceInMinutes, format } from 'date-fns';
import { client } from 'apiClient';
import { useAppSelector } from 'lib/store/app-store';


function updateToken(loginToken: string, refreshToken: string) {
  localStorage.setItem(config.storage.token, loginToken);
  localStorage.setItem(config.storage.refreshToken, refreshToken);
  localStorage.setItem(config.storage.loginTime, JSON.stringify(format(new Date(), 'MM-dd-yyy HH:mm')));
}

export default function RefreshToken() {
  const { pretaaAdmin, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 
  }, [window]);


  useEffect(() => {
    const interval = 1000 * 30 * 5; // 5 min

    setInterval(async () => {
      const tokenObj: string = localStorage.getItem(config.storage.refreshToken) as string;
      const timeObj: string = localStorage.getItem(config.storage.loginTime) as string;
      if (tokenObj && timeObj) {
        const totalM = differenceInMinutes(new Date(), new Date(JSON.parse(timeObj)));
        /**
         * If difference greater than 20 min
         * Then
         */
        if (totalM > 20) {
          try {
            if (config.storage.owner_store && !!pretaaAdmin?.email?.length) {
              const response = await client.mutate<RegenerateOwnerToken, RegenerateOwnerTokenVariables>({
                mutation: regenerateOwnerToken,
                variables: { refreshToken: tokenObj },
              });
              if (response.data) {
                updateToken(
                  response.data.pretaaHealthAdminRegenerateTokens.loginToken,
                  response.data.pretaaHealthAdminRegenerateTokens.refreshToken
                );
              }
            }

            if (config.storage.user_store && !!user?.pretaaHealthCurrentUser?.email?.length) {
              const response = await client.mutate<RegenerateToken, RegenerateTokenVariables>({
                mutation: regenerateToken,
                variables: { refreshToken: tokenObj },
              });
              if (response.data) {
                updateToken(
                  response.data.pretaaHealthRegenerateRefreshTokens.loginToken,
                  response.data.pretaaHealthRegenerateRefreshTokens.refreshToken
                );
              }
            }
          } catch (e: any) {
            console.error('Unable to update token', e.message);
          }
        }
      }
    }, interval);
  }, []);

  return <div></div>;
}
