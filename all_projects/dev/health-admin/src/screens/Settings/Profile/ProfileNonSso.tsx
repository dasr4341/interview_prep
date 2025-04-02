import { Avatar } from '@mantine/core';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { stringFullNameAvatar } from 'lib/get-name-intials';
import { useAppSelector } from 'lib/store/app-store';
import React from 'react';
import { BsChevronRight } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { routes, externalRoutes } from 'routes';
import InviteSupporterPopup from 'screens/Patient/components/InviteSupporterPopup/InviteSupporterPopup';
import './_profile.scoped.scss';
import { UserTypeRole } from 'health-generatedTypes';
import useSelectedRole from 'lib/useSelectedRole';

export default function ProfileNonSso() {
  const userData = useAppSelector((state) => state?.auth?.user);
  const isPatient = useSelectedRole({ roles: [UserTypeRole.PATIENT] });

  const customStyles = {
    root: {
      width: '126px',
      height: '126px',
      borderRadius: '50%',
    },
    placeholder: {
      color: '#ffcc01',
      fontSize: '40px',
      fontWeight: 500,
      backgroundColor: '#000000', 
    }
  };



  return (
    <div>
      <ContentHeader title="Profile" className="lg:sticky" disableGoBack={true}></ContentHeader>

      <ContentFrame>
        <div
          className="bg-white w-full 
        px-6 py-6 text-base items-center rounded-xl border-gray-100">
          <div className="block md:flex md:flex-row md:items-center md:justify-between pb-6 w-full">
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex justify-center md:justify-start md:flex-none md:w-40">
                <Avatar
                  styles={customStyles}
                  radius="xl"
                  {...(stringFullNameAvatar(
                    `${userData?.pretaaHealthCurrentUser.firstName || ''} ${
                      userData?.pretaaHealthCurrentUser.lastName || ''
                    }`,
                  ) || 'N/A')}
                />
              </div>
              <div className="flex flex-col md:gap-0 gap-1">
                <span className="text-black font-bold flex justify-center md:justify-start text-md">
                  <div className="grow">
                    <h2 className='pt-4 pb-10 md:p-0'>
                      {`${userData?.pretaaHealthCurrentUser.firstName || ''} ${
                        userData?.pretaaHealthCurrentUser.lastName || ''
                      }` || 'N/A'}
                    </h2>
                  </div>
                </span>
              </div>
            </div>
            <div className="">
              <Link
                to={routes.logout.match}
                data-testid="logoutButton"
                style={{ minWidth: '180px' }}
                className="btn hover:border-yellow-800 
            hover:bg-yellow-800 hover:text-black px-6 md:px-14 h-11 justify-center 
            flex items-center undefined">
                Logout
              </Link>
            </div>
          </div>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white w-full 
        px-6 py-6 text-base items-center rounded-t-xl
        last:rounded-b-xl border-gray-100 border-b
        last:border-b-0 mt-10">
          <div className="text-pt-primary font-bold">
            <h2>Email</h2>
          </div>
          <div className="text-gray-600 font-normal" data-testid="logged-in-email-id">
            {userData?.pretaaHealthCurrentUser.email}
          </div>
        </div>

        <div
          className="grid grid-cols-2 gap-4 bg-white w-full 
        px-6 py-6 text-base items-center
        last:rounded-b-xl border-gray-100 border-b
        last:border-b-0">
          <div className="text-pt-primary font-bold">
            <h2>Password</h2>
            <Link
              className="text-gray-600 font-normal text-sm underline cursor-pointer mt-2"
              to={routes.changePassword.match}>
              Change Password
            </Link>
          </div>
          <div className="text-gray-600 font-normal">
            <input type="password" className="password-field p-0 w-full md:w-auto md:py-2 md:pr-3" value="F41Nx629@$lU" disabled />
          </div>
        </div>

        <Link
          state={userData?.pretaaHealthCurrentUser.twoFactorAuthentication}
          to={'/dashboard/settings/authentication'}
          className="flex flex-row bg-white w-full 
        px-6 py-6 text-base justify-between items-center first:rounded-t-xl
        last:rounded-b-xl border-gray-100 border-b
        last:border-b-0">
          <div className="text-pt-primary font-bold">
            <h2>Set up two-factor authentication</h2>
            <p className="text-pt-secondary text-more font-normal">
              {userData?.pretaaHealthCurrentUser.twoFactorAuthentication ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div className="text-gray-600">
            <BsChevronRight />
          </div>
        </Link>

        {isPatient && (
          <React.Fragment>
            <Link
              to={routes.profileContacts.match}
              className="flex flex-row bg-white w-full 
 px-6 py-6 text-base justify-between items-center first:rounded-t-xl
 last:rounded-b-xl border-gray-100 border-b
 last:border-b-0">
              <div className="text-pt-primary font-bold">
                <h2>Contacts</h2>
              </div>
              <div className="text-gray-600">
                <BsChevronRight />
              </div>
            </Link>
            <div
              className=" flex-row bg-white w-full 
px-6 py-6 text-base justify-between items-center first:rounded-t-xl
last:rounded-b-xl border-gray-100 border-b
last:border-b-0 hidden">
              <div className="text-pt-primary font-bold">
                <h2>Supporters</h2>
              </div>
              <div className="text-gray-600">
                <InviteSupporterPopup />
              </div>
            </div>
          </React.Fragment>
        )}

        <Link
          to={'#'}
          onClick={() => {
            window.open(externalRoutes.privacyPolicy);
          }}
          className="flex flex-row bg-white w-full 
        px-6 py-6 text-base justify-between items-center first:rounded-t-xl
        last:rounded-b-xl border-gray-100 border-b
        last:border-b-0">
          <div className="text-pt-primary font-bold">
            <h2>Privacy Policy</h2>
          </div>
          <div className="text-gray-600">
            <BsChevronRight />
          </div>
        </Link>

        <Link
          to={'#'}
          onClick={() => {
            window.open(externalRoutes.termsOfService);
          }}
          className="flex flex-row bg-white w-full 
        px-6 py-6 text-base justify-between items-center first:rounded-t-xl
        last:rounded-b-xl border-gray-100 border-b
        last:border-b-0">
          <div className="text-pt-primary font-bold">
            <h2>Terms of Service</h2>
          </div>
          <div className="text-gray-600">
            <BsChevronRight />
          </div>
        </Link>

        <Link
          to={'#'}
          onClick={() => {
            window.open(externalRoutes.help);
          }}
          className="flex flex-row bg-white w-full 
        px-6 py-6 text-base justify-between items-center first:rounded-t-xl
        last:rounded-b-xl border-gray-100 border-b
        last:border-b-0">
          <div className="text-pt-primary font-bold">
            <h2>Contact Pretaa</h2>
          </div>
          <div className="text-gray-600">
            <BsChevronRight />
          </div>
        </Link>
      </ContentFrame>
    </div>
  );
}
