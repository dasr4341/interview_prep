import React, { useEffect } from 'react';

import { SideNavBar } from 'components/NavBar/SideNavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import ImpersonationBar from 'components/ImpersonationBar';
import { PatientEventActionTypes, UserTypeRole } from 'health-generatedTypes';
import messagesData from 'lib/messages';
import WarningIcon from 'components/icons/WarningIcon';
import './_dashboard.scoped.scss';
import { getRedirectUrl, getRedirectUrlForPretaaAdmin } from 'lib/api/users';
import { routes } from 'routes';
import useSelectedRole from 'lib/useSelectedRole';
import { appSliceActions } from 'lib/store/slice/app/app.slice';

export default function Dashboard() {
  const user = useAppSelector((state) => state.auth.user?.pretaaHealthCurrentUser);
  const userObj = useAppSelector((state) => state.auth.user);
  const pretaaAdmin = useAppSelector((state) => state.auth.pretaaAdmin);
  const navigate = useNavigate();
  const isSupporter = useSelectedRole({ roles: [UserTypeRole.SUPPORTER] });
  const appEvents = useAppSelector((state) => state.app.appEvents);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (appEvents) {
      setTimeout(() => {
        dispatch(appSliceActions.setAppEvents(null));
      }, 2000);
    }
  }, [appEvents]);
  

  useEffect(() => {
    if (pretaaAdmin?.id && location.pathname === '/dashboard') {
      navigate(getRedirectUrlForPretaaAdmin(pretaaAdmin));
    } else if (user?.id && location.pathname === '/dashboard') {
      navigate(getRedirectUrl(userObj));
    } else if (!user && !pretaaAdmin && location.pathname === '/dashboard') {
      navigate(routes.login.match);
    }
  // 
  },  [pretaaAdmin?.id, userObj?.pretaaHealthCurrentUser.id]);

  return (
    <div className={`bg-gray-50 grid-main-layout word-break dashboard-wrapper ${!user && !pretaaAdmin ? 'hidden' : ''}`}>
      <SideNavBar />
      <div className="flex flex-col lg:px-0  dashboard-content">
        {user && <ImpersonationBar />}

        {isSupporter && user?.patientPermissionToSupporter !== PatientEventActionTypes.ACCEPTED && (
          <div className='bg-yellow-500 flex text-base justify-center items-center'>     
            {
               
            }     
           <WarningIcon className="w-10 h-10  rounded-full p-2" />
           <p>{
            !user?.patientPermissionToSupporter
            ? messagesData.errorList.supporterInvitationPendingByPatient
            : messagesData.errorList.supporterInvitationDeclinedByPatient
           }</p>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
}
