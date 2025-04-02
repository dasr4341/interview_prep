import { RootState } from 'lib/store/app-store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useLocation } from 'react-router-dom';
import logo from 'assets/images/logo.svg';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { routes } from 'routes';
import { FiSettings } from 'react-icons/fi';
import { makeNavLinkStyle2 } from './Nav';
import version from '../version.json';
import { resetState } from 'lib/api/users';


export function AdminNav(): JSX.Element {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const adminUser = useSelector((state: RootState) => state.auth.admin);

  return (
    <div className="nav-wrapper">
      <div className="bg-primary-light nav-mobile flex items-center justify-between">
        <Link to="/" className="h1">
          <img src={logo} alt="logo" />
        </Link>
        <button className="p-2 text-white" onClick={() => setOpen(true)}>
          <AiOutlineMenu />
        </button>
      </div>
      <nav
        className={`side-nav bg-primary-light flex flex-col h-screen shadow-nav text-white overflow-auto p-2
          ${open ? 'open' : ''}`}>
        <div className="flex flex-1 flex-col space-y-4 p-6 lg:space-y-8 lg:p-10 text-white">
          <div className="flex justify-between  items-center  mb-8">
            <Link to="/" className="h1">
              <img src={logo} alt={logo} />
            </Link>
            <button onClick={() => setOpen(false)} className="p-2 cursor-pointer lg:invisible">
              <AiOutlineClose />
            </button>
          </div>

          {adminUser?.pretaaAdminCurrentUser && (
            <div
              className={`flex flex-col py-4 px-8 -ml-8 -mr-12 rounded-l-2xl overflow-auto 
          ${location.pathname.includes('/settings') ? 'bg-white' : ''}`}>
              <NavLink
                to={routes.controlPanelScreen.match}
                className={() =>
                  ' block' + (location.pathname.includes('/settings') ? ' font-bold text-primary' : 'text-white')
                }>
                <FiSettings className="mr-2 inline-block" />
                Settings
              </NavLink>

              <div className="pl-4">
                {location.pathname.includes('/super-admin/settings/') && (
                  <>
                    <h3
                      className={`text-primary mt-2 pt-4 pb-4 ${
                        location.pathname.includes('/super-admin/settings') ? 'font-bold' : ''
                      }`}>
                      <Link to={routes.controlPanelScreen.match}>Admin</Link>
                    </h3>
                      <div className="pl-4 mb-2 nav-link-fontsize">
                        {makeNavLinkStyle2(routes.controlPanelScreen.match, 'Control Panel')}
                      </div>
                      <div className="pl-4 mb-2 nav-link-fontsize">
                        {makeNavLinkStyle2(routes.superUserChangePassword.match, 'Change Password')}
                      </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <footer className="border-t border-border grid grid-cols-1 space-y-4 p-8">
          <div className="flex justify-between">
            <a href="https://pretaa.com/support/">Help</a>
            <button
              data-test-id="logout"
              onClick={() => {
                resetState();
                window.location.href = routes.superUserLogin.match;
              }}>
              Logout
            </button>
          </div>
          <div className="flex flex-col space-y-1.5">
            <div className="col-span-2 flex flex-col">Privacy Policy</div>
            <div className="col-span-2 flex flex-col">Terms of Service</div>
          </div>
          <label>Version {version.version}</label>
        </footer>
      </nav>
    </div>
  );
}
