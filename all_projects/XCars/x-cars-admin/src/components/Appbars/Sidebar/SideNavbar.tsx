import { IoChevronForward, IoChevronBack, IoCarSport } from 'react-icons/io5';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { dashboardRootRoute, navbarRouters, routes } from '@/config/routes';
import { usePathname } from 'next/navigation';
import AppNavLink from '@/components/AppNavLink';
import useResetApp from '@/components/useResetApp';

const SideNavbar = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
}) => {
  const path = usePathname();
  const { logout } = useResetApp();

  const [navLink, setNavLink] = useState(() =>
    [dashboardRootRoute, ...Object.values(navbarRouters)].map((nav) => ({
      ...nav,
      isActive: false,
    }))
  );

  useEffect(() => {
    setNavLink((prev) =>
      prev.map((e) => {
        if (path === dashboardRootRoute.path) {
          return { ...e, isActive: e.path === path };
        }
        return {
          ...e,
          isActive: e.path !== dashboardRootRoute.path && path.includes(e.path),
        };
      })
    );
  }, [path]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`sm:flex relative flex-col justify-start min-h-screen h-full bg-white z-20 transition-all duration-300 max-h-[100vh] py-6 shadow-md ${
        isCollapsed ? 'px-2' : 'px-4'
      }`}
    >
      <div
        className="absolute -right-3 top-10 bg-gray-700 bg-opacity-75 p-1 rounded-full cursor-pointer"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <IoChevronForward className="text-white" size={15} />
        ) : (
          <IoChevronBack className="text-white" size={15} />
        )}
      </div>

      <div className=" ps-2">
        <div
          className={`hover:cursor-pointer text-center flex text-4xl tracking-wider font-extrabold gap-4 drop-shadow-sm ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <IoCarSport className=" text-gray-800" />
          {!isCollapsed && <span className="text-gray-800">XCars</span>}
        </div>
      </div>

      <div className={`my-5 h-full flex flex-col justify-between`}>
        <div className="flex flex-col gap-1.5 ">
          {navLink.map((d) => (
            <AppNavLink
              className="rounded-md text-medium text-gray-600 hover:bg-gray-300 hover:text-gray-700"
              isActiveClassName="bg-gray-300 text-gray-700 font-bold"
              {...d}
              key={d.path}
              isCollapsed={isCollapsed}
              isClickable={true}
            />
          ))}
        </div>
        <div>
          <AppNavLink
            className="rounded-md text-medium text-gray-600 hover:bg-gray-300 hover:text-gray-700"
            isActiveClassName="bg-gray-300 text-gray-700 font-bold"
            icon={routes.dashboard.children.profile.icon}
            isCollapsed={isCollapsed}
            path={routes.dashboard.children.profile.path}
            name={'Profile'}
            isActive={false}
            isClickable={true}
          />
          <button
            onClick={logout}
            className={` text-gray-600 hover:bg-gray-300 hover:text-gray-700 rounded-md text-lg w-full flex items-center text-md tracking-wide $px-3 py-2 ${isCollapsed ? 'justify-center ' : 'gap-4 ps-2.5'}`}
          >
            {routes.logout.icon && routes.logout.icon}
            {!isCollapsed && <div>{routes.logout.name}</div>}
          </button>
        </div>
      </div>
    </aside>
  );
};
export default SideNavbar;
