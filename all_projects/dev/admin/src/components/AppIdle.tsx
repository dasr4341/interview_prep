/* eslint-disable react-hooks/exhaustive-deps */

import { RootState } from 'lib/store/app-store';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import React, { useState } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { routes } from 'routes';
import { TrackingApi, AnalyticsEvents } from './Analytics';
import { TimeOutModal } from './TimeOutModal';
import faker from 'faker';

export default function AppIdle() {

  const [visible, setVisible] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user?.currentUser);
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);
  const dispatch = useDispatch();


  const handleOnActive = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (getRemainingTime() === 0 && currentUser?.id) {
      setVisible(true);
      window.location.href = routes.logout.match;
    }
  };

  const { getRemainingTime } = useIdleTimer({
    timeout: 1000 * 60 * 60, // 60 min
    onActive: handleOnActive,
    debounce: 500
  });


  const handleOnSessionResume = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (currentUser?.id) {
      console.log('resume');
      const id = faker.datatype.uuid();
      dispatch(authSliceActions.setSessionId(id));
      TrackingApi.track(AnalyticsEvents.SessionStart, { sessionId: id });
    }
  };

  const handleOnSessionIdle = () => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (currentUser?.id) {
      console.log('Idle');
      TrackingApi.track(AnalyticsEvents.SessionEnd, { sessionId } );
      dispatch(authSliceActions.setSessionId(null));
    }
  };

  useIdleTimer({
    timeout: 1000 * 60, // 1 min
    onActive: handleOnSessionResume,
    onIdle: handleOnSessionIdle,
    debounce: 500
  });


  const handleSubmit = () => {
    setVisible(false);
    window.location.href = routes.login.match;
  };

  return (
    <TimeOutModal visible={visible} onSubmit={handleSubmit}/>
  );
}
