/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProfileSubmitForm } from '../../Lib/Interface/User/UserSubmitInterface';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../Lib/Store/User/User.Slice';
import InputFieldComponent from '../../Components/InputField/InputFieldComponent';
import ButtonComponent2 from '../../Components/Button/ButtonComponent2';
import EditIcon from '../../Icons/Edit-Icon';
import ProfilePlaceholderIcon from '../../Icons/ProfilePlaceholder-Icon';
import EmailIcon2 from '../../Icons/Email-Icon2';
import NameIcon from '../../Icons/Name-Icon';
import PhoneIcon from '../../Icons/Phone-Icon';
import AddressIcon from '../../Icons/Address-Icon';
import CameraIcon from '../../Icons/Camera-Icon';
import UploadImageModal from '../../Components/Modal/UploadImageModal';
import { useAppSelector } from '../../Lib/Store/hooks';

export default function () {
  const ProfileSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup.string().email('Email must be a valid email'),
    address: yup
      .string()
      .min(4, 'Address must be at least 4 characters')
      .max(40, 'Address must be at most 40 characters')
      .required('Address is required'),
    phone: yup
      .string()
      .required('Phone Number is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
  });

  const dispatch = useDispatch();

  const user = useAppSelector((state) => state.user.currentUser);

  const [nameDisabled, setnameDisabled] = useState(true);
  const [phoneDisabled, setphoneDisabled] = useState(true);
  const [addressDisabled, setaddressDisabled] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileSubmitForm>({
    mode: 'onChange',
    resolver: yupResolver(ProfileSchema),
  });

  const onSubmit = (data: ProfileSubmitForm) => {
    dispatch(
      userSliceActions.updateProfile({
        name: data.name,
        phone: data.phone,
        address: data.address,
      })
    );
    dispatch(userSliceActions.getProfile());
    setnameDisabled(true);
    setphoneDisabled(true);
    setaddressDisabled(true);
  };

  useEffect(() => {
    dispatch(userSliceActions.getProfile());
  }, []);

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('address', user.address);
    }
  }, [user]);

  const handleNameDisabledState = () => {
    if (nameDisabled === true) {
      setnameDisabled(false);
    } else {
      setnameDisabled(true);
    }
  };
  const handlePhoneDisabledState = () => {
    if (phoneDisabled === true) {
      setphoneDisabled(false);
    } else {
      setphoneDisabled(true);
    }
  };
  const handleAddressDisabledState = () => {
    if (addressDisabled === true) {
      setaddressDisabled(false);
    } else {
      setaddressDisabled(true);
    }
  };

  const [modalView, setmodalView] = useState(false);
  const setModalFalse = () => {
    setmodalView(false);
  };

  return (
    <>
      <UploadImageModal modalView={modalView} setModalFalse={setModalFalse} />
      <div className='bg-white w-full flex justify-center items-center md:m-2 py-5'>
        <form
          className='bg-white rounded-lg md:drop-shadow m-1 p-5 md:m-5 md:p-5 w-full md:w-2/3 h-full overflow-y-auto'
          onSubmit={handleSubmit(onSubmit)}>
          <div className='container mb-10'>
            <h1 className=' text-4xl font-semibold'>Profile</h1>
          </div>
          <div className='grid grid-cols-1 gap-4 mb-5'>
            <div className='m-auto'>
              <div className=' w-44 h-44 bg-cyan-100 rounded-full flex justify-center items-center relative'>
                <span className='opacity-90'>{<ProfilePlaceholderIcon width='100' height='100' />}</span>
                <span
                  onClick={() => setmodalView(true)}
                  className='absolute w-8 h-8 rounded-full flex justify-center items-center 
                  bg-black text-white p-2 right-4 bottom-2 cursor-pointer opacity-90'>
                  {<CameraIcon width='15' height='15' />}
                </span>
              </div>
            </div>
            <div className=''>
              <h3 className='pb-3'>Name</h3>
              <div className=' relative '>
                <InputFieldComponent
                  icon={<NameIcon width='15' height='15' />}
                  name='name'
                  type='text'
                  placeholder='Name'
                  register={register('name')}
                  disabled={nameDisabled}
                  paddingRight={true}
                />
                <div
                  onClick={handleNameDisabledState}
                  className={`absolute ${nameDisabled ? 'opacity-50' : ''} right-2 top-3 cursor-pointer`}>
                  {<EditIcon width='18' height='18' />}
                </div>
                <span className='text-xs text-red-500'>{errors.name?.message}</span>
              </div>
            </div>
            <div className=''>
              <h3 className='pb-3'>Email</h3>
              <div className=' relative '>
                <InputFieldComponent
                  icon={<EmailIcon2 width='15' height='15' />}
                  name='email'
                  type='text'
                  placeholder='Email'
                  register={register('email')}
                  disabled={true}
                  paddingRight={true}
                />
                <span className='text-xs text-red-500'>{errors.email?.message}</span>
              </div>
            </div>

            <div className=''>
              <h3 className='pb-3'>Phone</h3>
              <div className=' relative '>
                <InputFieldComponent
                  icon={<PhoneIcon width='15' height='15' />}
                  name='phone'
                  type='text'
                  placeholder='Phone'
                  register={register('phone')}
                  disabled={phoneDisabled}
                  paddingRight={true}
                />
                <div
                  onClick={handlePhoneDisabledState}
                  className={`absolute ${phoneDisabled ? 'opacity-50' : ''} right-2 top-3 cursor-pointer`}>
                  {<EditIcon width='18' height='18' />}
                </div>
                <span className='text-xs text-red-500'>{errors.phone?.message}</span>
              </div>
            </div>

            <div className=''>
              <h3 className='pb-3'>Address</h3>
              <div className=' relative '>
                <InputFieldComponent
                  icon={<AddressIcon width='15' height='15' />}
                  name='address'
                  type='text'
                  placeholder='Address'
                  register={register('address')}
                  disabled={addressDisabled}
                  paddingRight={true}
                />
                <div
                  onClick={handleAddressDisabledState}
                  className={`absolute ${addressDisabled ? 'opacity-50' : ''} right-2 top-3 cursor-pointer`}>
                  {<EditIcon width='18' height='18' />}
                </div>
                <span className='text-xs text-red-500'>{errors.address?.message}</span>
              </div>
            </div>
          </div>
          <div className='w-full text-gray-500'>
            {(nameDisabled && phoneDisabled && addressDisabled ? false : true) && (
              <ButtonComponent2 loading={false} color={'black'} type={'submit'}>
                Save
              </ButtonComponent2>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
