import React, { useEffect } from 'react';
import LoadingOverLay from '../Components/Loading/LoadingOverLay';
import routes from '../Lib/Routes/Routes';
import { helperSliceActions } from '../Lib/Store/Helper/Helper.Slice';
import { useAppDispatch, useAppSelector } from '../Lib/Store/hooks';

/**
 * It checks if the user is logged in, if so, it sets the redirect url to the user's profile page, if not, it sets the
 * redirect url to the login page
 * This page is only for redirect purposes 
 */

export default function Index() {
  const user = useAppSelector(state => state.user.currentUser);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log({ user });
    
    if (user) {
      dispatch(helperSliceActions.setRedirectUrl(routes.app.children.me.fullPath));
    } else {
      dispatch(helperSliceActions.setRedirectUrl(routes.login.path));
    }
  }, [user, dispatch]);

  return (
    <>
      <LoadingOverLay />
    </>
  );
}
