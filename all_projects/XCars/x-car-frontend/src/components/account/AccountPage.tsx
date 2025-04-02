'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import React, { useEffect, useState } from 'react';
import { FaRegUser } from 'react-icons/fa6';
import { ProfileDetails } from './AccountDetailsRow';
import { useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import catchError from '@/lib/catch-error';
import { UPDATE_END_USER } from '@/graphql/updateUser.mutation';
import { Loader } from '@mantine/core';
import { getCurrentUserDetails } from '@/store/app/app.slice';
import { messageGenerators } from '@/config/messages';

export default function Profile() {
  const userData = useAppSelector((state) => state.app.user);
  const dispatch = useAppDispatch();
  const [name, setName] = useState({
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    location: userData?.location,
    email: userData?.email,
  });
  useEffect(() => {
    setName({
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      location: userData?.location,
      email: userData?.email,
    });
  }, [userData]);

  const [handleUpdateProfile, { loading }] = useMutation(UPDATE_END_USER, {
    onCompleted: () => {
      dispatch(getCurrentUserDetails());
      toast.success(messageGenerators.successMessage('Profile updated'));
    },
    onError: (e) => catchError(e, true),
  });
  const handleClickUpdateProfile = () => {
    if (
      name.firstName === userData?.firstName &&
      name.lastName === userData?.lastName &&
      name.location === userData?.location &&
      name.email === userData?.email
    ) {
      toast.info(messageGenerators.noChanges);
    } else {
      handleUpdateProfile({ variables: name });
    }
  };

  return (
    <>
      <div className=" bg-white px-8 w-11/12 md:w-4/6 mx-auto rounded-md mt-10 pb-10">
        <section className="  flex flex-col justify-center items-center">
          <div className=" w-30 h-30 rounded-full bg-gray-100  p-8">
            <FaRegUser size={35} className=" text-teal-900" />
          </div>
          <div className=" font-bold text-2xl mt-6 text-teal-950">
            My Profile
          </div>

          <div className=" flex flex-col gap-5 mt-6 w-full items-center">
            <ProfileDetails
              label={'First Name'}
              value={name?.firstName}
              onChange={(e) => setName({ ...name, firstName: e.target.value })}
              editable
            />
            <ProfileDetails
              label={'Last Name'}
              value={name?.lastName}
              onChange={(e) => setName({ ...name, lastName: e.target.value })}
              editable
            />
            <ProfileDetails
              label={'Email'}
              value={name?.email}
              onChange={(e) => setName({ ...name, email: e.target.value })}
              editable
            />
            <ProfileDetails
              label={'Phone Number'}
              value={userData?.phoneNumber}
            />
            <ProfileDetails
              label={'Location'}
              value={name?.location}
              onChange={(e) => setName({ ...name, location: e.target.value })}
              editable
            />
            <button
              onClick={handleClickUpdateProfile}
              className="flex items-center px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded"
            >
              Save Changes {loading && <Loader size={18} color="white" />}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
