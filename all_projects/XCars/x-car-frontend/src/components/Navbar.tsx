'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { MdEdit, MdAccountCircle } from 'react-icons/md';
import { FaSortDown, FaSortUp } from 'react-icons/fa6';
import RegistrationForm from './dealer/RegistrationForm';
import { routes } from '@/config/routes';
import LoginModal from './auth/LoginModal';
import Link from 'next/link';
import { BsCardChecklist } from 'react-icons/bs';
import { CgNotes } from 'react-icons/cg';
import { IoIosLogOut } from 'react-icons/io';
import { appSliceActions } from '@/store/app/app.slice';
import { usePathname } from 'next/navigation';
import useLogout from './hooks/Logout';

const NavLink = ({
  title,
  link,
  icon,
  onClick,
}: {
  title: string;
  link: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <Link
      onClick={onClick}
      href={link}
      className="flex hover:bg-gray-200 items-center gap-4 justify-start w-full px-4 py-3 tracking-wide text-left text-gray-900 text-sm font-semibold capitalize"
    >
      {icon}
      {title}
    </Link>
  );
};
function isLinkActive(link: string, currentPath: string) {
  if (currentPath.includes(link)) {
    return true;
  }
  return false;
}

const navLink = [
  {
    link: routes.account.children.orders.path,
    title: routes.account.children.orders.name,
    icon: <CgNotes size={15} />,
  },
  {
    link: routes.account.children.quotes.path,
    title: routes.account.children.quotes.name,
    icon: <BsCardChecklist size={15} />,
  },
];

const Navbar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path = usePathname();
  const userData = useAppSelector((state) => state.app.user);
  const loginModalState = useAppSelector((state) => state.app.modal.login);
  const [openDealerModal, setOpenDealerModal] = useState<boolean>(false);

  const handleCloseLoginModal = () => {
    dispatch(appSliceActions.setLoginModel(false));
  };

  const handleLogout = useLogout();

  return (
    <>
      <div className="flex gap-4 w-full items-center py-4 px-6 lg:px-12 bg-gray-100 shadow-md">
        <div className="flex gap-8 items-center w-1/2">
          <div className="text-2xl font-bold hover:cursor-pointer">XCars</div>
          <div className="flex gap-3 items-center">
            <Link
              href={routes.buyCars.path}
              className={`${isLinkActive(routes.buyCars.path, path) ? ' border-y-0 border-x-0 border border-b-2  border-orange-400' : ''} hover:bg-orange-300 bg-orange-200  font-medium px-3 py-1.5 text-sm rounded-sm text-gray-600`}
            >
              {routes.buyCars.name}
            </Link>
          </div>
        </div>
        <div className="flex-1 justify-end flex items-center gap-8">
          {!userData?.id && (
            <button
              onClick={() => setOpenDealerModal(true)}
              className="border-theme hover:bg-orange-100 border  capitalize text-sm rounded-lg px-4 py-2 font-semibold text-gray-800"
            >
              Register as dealer
            </button>
          )}
          <div className="relative group">
            <button
              className={`flex items-center   space-x-2 text-gray-700  font-semibold`}
            >
              <MdAccountCircle size={25} />
              <div className=" flex flex-col items-start justify-start px-2">
                <div className=" text-xs text-gray-800 font-normal">
                  Hello, {!userData?.id && 'Sign in'}
                </div>
                <div className=" text-md text-gray-900 font-bold">Account</div>
              </div>
              <FaSortDown
                size={15}
                className="block group-hover:hidden duration-300"
              />
              <FaSortUp
                size={15}
                className="hidden group-hover:block duration-300"
              />
            </button>

            <div className="absolute hidden group-hover:flex group-hover:flex-col right-0 mt-0.5 p-3 w-60 bg-white border border-gray-200 rounded-md shadow-lg pb-4 duration-300 z-10">
              {userData?.id && (
                <>
                  <div className=" flex justify-between items-center px-4 py-4">
                    <div className="flex flex-col w-full text-left text-gray-700 hover:bg-gray-100">
                      Hello, {userData.firstName}
                      <span className=" text-gray-600 text-xs">
                        {userData?.phoneNumber}
                      </span>
                    </div>

                    <MdEdit
                      size={20}
                      className=" hover:cursor-pointer"
                      onClick={() => {
                        router.push(routes.account.path);
                      }}
                    />
                  </div>
                  <hr className=" mx-3 my-5 text-gray-200 font-semibold" />

                  <div className=" bg-gray-200 rounded-lg p-2 divide-y divide-slate-200 bg-opacity-75">
                    {navLink.map((e) => (
                      <NavLink onClick={() => {}} key={e.link} {...e} />
                    ))}
                    {/* {userData?.id && (
                      <button
                        onClick={() => setOpenDealerModal(true)}
                        className="flex hover:bg-gray-200 items-center gap-4 justify-start w-full px-4 py-3 tracking-wide text-left text-gray-900 text-sm font-semibold capitalize"
                      >
                        <FaIdeal />
                        Be a dealer
                      </button>
                    )} */}
                    {userData?.id && (
                      <NavLink
                        onClick={handleLogout}
                        link={routes.buyCars.path}
                        title={routes.logout.name}
                        icon={<IoIosLogOut size={15} />}
                      />
                    )}
                  </div>
                </>
              )}
              {!userData?.id && (
                <button
                  onClick={() => {
                    dispatch(appSliceActions.setLoginModel(true));
                  }}
                  className="w-full font-semibold text-white  py-2 bg-theme rounded-md "
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {openDealerModal && (
        <RegistrationForm setOpenModal={setOpenDealerModal} />
      )}

      <LoginModal
        modalState={loginModalState}
        onClose={handleCloseLoginModal}
      />
    </>
  );
};

export default Navbar;
