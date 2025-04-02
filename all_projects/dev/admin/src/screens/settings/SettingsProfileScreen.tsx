import React, { useEffect, useState } from 'react';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { Link, useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import NameInitials from 'components/ui/nameInitials/NameInitials';
import useQueryParams from '../../lib/use-queryparams';
import closeWhiteIcon from '../../assets/icons/icon-close-white.svg';
import { LabeledValue } from 'components/LabeledValue';
import '../../scss/modules/_setting-profile-screen.scss';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { TrackingApi } from 'components/Analytics';

function EditButton() {
  return <button className="font-medium text-gray-700 text-xs underline">Change Password</button>;
}

export default function SettingsProfileScreen(): JSX.Element {
  const navigate = useNavigate();
  const query = useQueryParams();
  const [authenticateLabel, setAuthenticateLabel] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);

  useEffect(() => {
    setAuthenticateLabel(query?.authenticateLabel || false);
  }, [query]);

  const handleClose = () => {
    navigate(routes.settingsProfile.match);
    setAuthenticateLabel(false);
  };

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.settingsProfile.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Profile" breadcrumb={false} disableGoBack={true} />
      {authenticateLabel && (
        <div className="flex justify-between item-center w-full bg-orange pl-9 pr-9">
          <div className="text-white p-4 text-base" data-testid="error-id">
            {`Success! Two-Factor Authentication has been
                ${user?.twoFactorAuthentication ? 'enabled' : 'disabled'} `}
          </div>
          <img src={closeWhiteIcon} alt="white-icon" className="cursor-pointer w-3" onClick={handleClose} />
        </div>
      )}
      <ContentFrame className={`${authenticateLabel && 'profile-screen-main'}`}>
        <div className="bg-white mb-6 rounded">
          <div className="border-b flex space-x-6 items-center p-4">
            <NameInitials name={user?.firstName + ' ' + user?.lastName} />
            <div className="flex-1 font-bold pl-3">
              <label className="block font-bold">
                {user?.firstName} {user?.lastName}
              </label>
            </div>
            <Link to={routes.logout.match}>
              <Button>Logout</Button>
            </Link>
          </div>
          <LabeledValue className="p-3" label="Department">
            {user?.department}
          </LabeledValue>
        </div>
        <div className="bg-white rounded">
          <div className="border-b flex items-center p-4">
            <div className="flex-1">
              <label className="block font-bold">Username</label>
            </div>
            <div className="flex-1 text-gray-900">{user?.email}</div>
            <DisclosureIcon className="invisible" />
          </div>
          {user?.customer.oktaDomain === null && (
            <>
              <div className="border-b flex items-center p-4" data-test-id="password">
                <div className="flex-1">
                  <label className="block font-bold">Password</label>
                  <Link to={'/settings/preferences/reset-password'}>
                    <EditButton />
                  </Link>
                </div>
                <span className="flex-1 text-gray-900">*******</span>
                <Link to={'/settings/preferences/reset-password'}>
                  <DisclosureIcon />
                </Link>
              </div>
              <div className="border-b flex items-center p-4 rounded">
                <Link to={'/settings/preferences/two-step-auth'} className="flex justify-between items-center w-full">
                  <div>
                    <label className="font-bold">Set up two-factor authentication</label>
                    <div className="font-bold text-primary-light text-xs">{user?.twoFactorAuthentication && 'Enabled'}</div>
                  </div>
                  <DisclosureIcon />
                </Link>
              </div>
            </>
          )}
        </div>
      </ContentFrame>
    </>
  );
}
