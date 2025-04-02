/* eslint-disable react-hooks/exhaustive-deps */
import { userSliceActions } from 'Lib/Store/User/User.Slice';
import { useAppDispatch } from 'Lib/Store/hooks';
import React, { useEffect } from 'react';

export default function LogoutPage() {
  const dispatch = useAppDispatch();

  function logOut() {
    dispatch(userSliceActions.logout());
  }

  useEffect(() => {
    logOut();
  }, []);

  return <div>LogoutPage</div>;
}
