/* eslint-disable react-hooks/exhaustive-deps */
import { TrackingApi, AnalyticsEvents } from 'components/Analytics';
import { resetState } from 'lib/api/users';
import { RootState } from 'lib/store/app-store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { client } from '../apiClient';
import { routes } from '../routes';

export function LogoutScreen(): JSX.Element {
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);

  useEffect(() => {
    client.stop();
    client.resetStore().then(() => {
      resetState();
      TrackingApi.track(AnalyticsEvents.SessionEnd, { sessionId });
      TrackingApi.reset();
      window.location.href = routes.login.match;
    });
  }, []);

  return <div />;
}
