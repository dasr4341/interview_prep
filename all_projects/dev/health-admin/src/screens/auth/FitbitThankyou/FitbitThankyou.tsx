import LoginHeader from 'components/LoginHeader';
import CircledEmail from '../../../assets/images/email-icon-circle.svg';
import React, { useEffect, useState } from 'react';
import { getRedirectUrl, resetState } from 'lib/api/users';
import Button from 'components/ui/button/Button';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { useNavigate } from 'react-router-dom';
import { appSliceActions } from 'lib/store/slice/app/app.slice';

export default function FitbitThankyou(){
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  function logOut() {
    resetState();
    setIsLoggedOut(true);
  }

  useEffect(() => {
    if (currentUser) {
      const url = getRedirectUrl(currentUser);
      dispatch(appSliceActions.setAppEvents(null));
      navigate(url);
    }
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <LoginHeader />

      <div className="flex flex-col items-center p-20">
          <img src={CircledEmail} alt="email" width="152" height="152" />

          <div className='forgot-password-block'>
            <h3
              className="text-md xl:text-lg text-gray-150 mb-6 mt-6 xxl:mt-12 xxl:mb-20 text-center header-text">
              We have sent them an email inviting them to Pretaa.
            </h3>

            <div className='flex justify-center'>
              {!isLoggedOut && (
                <Button type="button" onClick={logOut}>Logout from pretaa</Button>
              )}
                
                <a className='ml-4' href="https://www.fitbit.com/logout/transferpage">
                  <Button type="button">Logout from fitbit</Button>
                </a>
            </div>

            {isLoggedOut && (
              <div className='flex justify-center mt-2'>
                Successfully logged out from pretaa
              </div>
            )}
            
          </div>
        </div>
    </div>
  );
}