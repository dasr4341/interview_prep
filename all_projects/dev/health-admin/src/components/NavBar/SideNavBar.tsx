import logo from 'assets/images/logo-small.svg';
import { Link, NavLink } from 'react-router-dom';
import { externalRoutes, routes } from '../../routes';
import '../../scss/modules/_nav.scss';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { useState } from 'react';
import version from '../../version.json';
import { useAppSelector } from 'lib/store/app-store';
import PretaaAdminNav from './PretaaAdminNav';
import PatientNav from './PatientNav';
import { config } from 'config';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { UserPermissionNames } from 'health-generatedTypes';
import MenuLink from './MenuLinks';
import RoleSwitcher from './RoleSwitcher/RoleSwitcher';
import FacilitySwitcher from './FacilitySwitcher/FacilitySwitcher';

export function makeSettingsNavLinks(route: string[], label: string, pathname?: string, level?: 'level-1' ) {
  if (!pathname) {
    pathname = location.pathname;
  }

  const counterSlash = pathname.split('/')?.length;
  const includePath = pathname.split('/').slice(0, counterSlash).join('/');
  const isActive = route.includes(includePath);

  let menuClass = 'text-primary block pb-2 ';
  if (isActive && !level ) {
    menuClass = menuClass + ' font-bold underline navlink-underline-active';
  }

  if (level === 'level-1') {
    if (isActive) {
      menuClass = 'bg-white text-primary px-6 py-3 lg:-ml-6 lg:-mr-12 lg:rounded-l-full';
    } else {
      menuClass = 'text-white';
    }
  }


  return (
    <NavLink to={route[0]} className={menuClass} data-test-id="navLink-el">
      {label}
    </NavLink>
  );
}


export function SideNavBar(): JSX.Element {
  const [open, setOpen] = useState(false);
  const pretaaAdmin = useAppSelector((state) => state.auth.pretaaAdmin);
  const hasFeedBack = useGetPrivilege(UserPermissionNames.FEEDBACK, CapabilitiesType.VIEW);


  return (
    <div className="nav-wrapper sticky overflow-hidden">
      <div className="p-4 bg-black nav-mobile flex items-center justify-between">
        <div className="h1">
          <img src={logo} alt={logo} />
        </div>
        <button className="text-white" onClick={() => setOpen(true)}>
          <AiOutlineMenu />
        </button>
      </div>
      <nav className={`side-nav bg-black flex flex-col h-screen shadow-nav text-white overflow-auto p-2 ${open ? 'open' : ''}`}>
        <div className='flex flex-col justify-between flex-1 space-y-4 p-6 lg:space-y-5 lg:p-10 pb-0 lg:pb-0'>
          <div className="flex flex-col text-white" data-testid="nav-menu-links">
            <div className="flex justify-between items-center mb-8">
              <div className="h1">
                <img src={logo} alt={logo} />
              </div>
              <button onClick={() => setOpen(false)} className="p-2 cursor-pointer lg:invisible close-button">
                <AiOutlineClose />
              </button>
            </div>

            <RoleSwitcher />


            <PatientNav onClick={() => {
              setOpen(false);
            }} />

            {pretaaAdmin?.id && <PretaaAdminNav onClick={() => {
              setOpen(false);
            }} />}
          
          </div>
          <FacilitySwitcher />
        </div>
        

        {/* ------------------------------- footer ---------------------------------*/}
        <footer className=" border-t border-border grid grid-cols-1 space-y-4 py-6 px-4  lg:py-10  lg:px-5  mt-5">
          <div className="flex justify-between col-span-2">
            {hasFeedBack && (
                <MenuLink onClick={() => {
                  setOpen(false);
               }} to={routes.feedback.match} data-testid="feedback" text='Feedback' activeMenuPaths="feedback" level='level-2' />
            )}
            <Link to={routes.logout.buildUrl({ userType: pretaaAdmin ? config.roles.owner : '' })} data-testid="logoutLink">
              Logout
            </Link>
          </div>
          <div className="col-span-2 flex flex-col">
          <Link
          to={'#'}
          onClick={() => {
            window.open(externalRoutes.help);
          }}>Contact Pretaa</Link>
          </div>
          <label>Version <br/>{version.version}</label>
          <label  className="invisible">Build {version.build}</label>
        </footer>
      </nav>
    </div>
  );
}
