import { routes } from '@/config/routes';
import Link from 'next/link';
import React from 'react';
import { ImCancelCircle } from 'react-icons/im';

const InvalidLink = () => {
  return (
    <div className=" min-h-screen flex flex-1 items-center justify-center ">
      <div className="shadow-lg md:min-w-96 px-10 py-8 rounded-lg">
        <div className=" flex flex-col gap-8 justify-center items-center">
          <ImCancelCircle className=" text-red-600" size={100} />
          <span className=" font-normal text-3xl">Link Expired</span>
          <span className=" text-sm w-96 text-center my-2 text-gray-500 tracking-wide">
            {`To reset your password, return to the login page and select "Forget
              Password" to get a new email.`}
          </span>
          <Link
            href={routes.login.path}
            className=" bg-blue-500 font-semibold text-white rounded-md px-4 py-3 text-sm flex justify-center items-center gap-1 hover:bg-blue-600 w-full capitalize"
          >
            back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InvalidLink;
