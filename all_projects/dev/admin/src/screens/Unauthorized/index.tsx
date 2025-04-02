/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { getRedirectAuth } from 'lib/redirect-auth';
import { RootState } from 'lib/store/app-store';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';

export default function UnAuthorizedScreen() {
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user?.currentUser);
  const adminUser = useSelector((state: RootState) => state.auth.admin);

  useEffect(() => {
    if (currentUser && currentUser.customer.onboarded === false) {
      const url = getRedirectAuth({ user: currentUser });
      if (url) {
        navigate(url);
      }
    } else if (!currentUser && !adminUser) {
      navigate(routes.login.match);
    }
  }, []);


  return (
    <div>
      <ContentHeader title='Unauthorized' breadcrumb={false}
        disableGoBack={true}>
      </ContentHeader>
      <ContentFrame>
       <h1 className='text-2xl'>UnAuthorized</h1>
      </ContentFrame>
    </div>
  );
}
