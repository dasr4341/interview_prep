import React from 'react';
import { PiLineVerticalThin } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/store/hooks';
import { routes } from '@/config/routes';

const Navbar = () => {
  const router = useRouter();
  const user = useAppSelector((state) => state.app.user);

  return (
    <nav className=" flex justify-end items-center p-4 bg-gray-200 ">
      <div className=" flex justify-between gap-5">
        <div className=" hidden sm:flex gap-3 items-center">
          <PiLineVerticalThin size={`45px`} className=" text-gray-300" />
          <span className=" text-md font-light text-gray-600">
            Hello, <span className=" font-bold text-gray-900">Admin</span>
          </span>
          {user?.firstName && user?.lastName && (
            <div
              className=" bg-red-300 rounded-full hover:cursor-pointer text-xl font-semibold p-3"
              onClick={() =>
                router.push(routes.dashboard.children.profile.path)
              }
            >
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
