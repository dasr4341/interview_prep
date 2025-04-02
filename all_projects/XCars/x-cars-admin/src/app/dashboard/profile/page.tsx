'use client';
import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { FaRegUser } from 'react-icons/fa6';
import { ProfileDetails } from '@/components/Profile/ProfileDetails';

export default function Page() {
  const { user, loading } = useAppSelector((state) => state.app);

  return (
    <section className=" bg-white p-8 w-11/12 md:w-4/6 mx-auto rounded-md flex flex-col justify-center items-center">
      <div className=" w-30 h-30 rounded-full bg-gray-100  p-8">
        <FaRegUser size={35} className=" text-teal-900" />
      </div>
      <div className=" font-bold text-2xl mt-6 text-teal-950">My Profile</div>

      <div className=" flex flex-col gap-8 mt-8 w-full items-center">
        <ProfileDetails
          label={'Name'}
          value={
            user?.firstName
              ? `${user?.firstName} ${user?.lastName ? user?.lastName : ''}`
              : null
          }
          loading={loading}
        />
        <ProfileDetails label={'Email'} value={user?.email} loading={loading} />
      </div>
    </section>
  );
}
