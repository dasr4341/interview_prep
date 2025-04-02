/* eslint-disable max-len */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import routes from '../../Lib/Routes/Routes';
import EyeIcon from '../../Icons/Eye-Icon';
import EyeSlashIcon from '../../Icons/EyeSlash-Icon';
import { RegisterSubmitForm } from '../../Lib/Interface/User/UserSubmitInterface';
import InputFieldComponent from '../../Components/InputField/InputFieldComponent';
import ButtonComponent2 from '../../Components/Button/ButtonComponent2';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../Lib/Store/User/User.Slice';
import NameIcon from '../../Icons/Name-Icon';
import EmailIcon2 from '../../Icons/Email-Icon2';
import PhoneIcon from '../../Icons/Phone-Icon';
import AddressIcon from '../../Icons/Address-Icon';
import LockIcon from '../../Icons/Lock-Icon';
import { useAppSelector } from '../../Lib/Store/hooks';

export default function RegisterPage() {
  const RegisterSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    email: yup.string().email('Email must be a valid email').required('Email is required'),
    phone: yup
      .string()
      .required('Phone Number is required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(10, 'Must be exactly 10 digits')
      .max(10, 'Must be exactly 10 digits'),
    address: yup
      .string()
      .min(4, 'Address must be at least 4 characters')
      .max(40, 'Address must be at most 40 characters')
      .required('Address is required'),
    password: yup
      .string()
      .min(4, 'Password must be at least 4 characters')
      .max(40, 'Password must be at most 40 characters')
      .required('Password is required'),
  });

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<RegisterSubmitForm>({
    mode: 'onChange',
    resolver: yupResolver(RegisterSchema),
  });

  const onSubmit = async (data: RegisterSubmitForm) => {
    dispatch(
      userSliceActions.register({
        ...data,
        firstName: data.firstName.charAt(0).toUpperCase() + data.firstName.slice(1),
        lastName: data.lastName.charAt(0).toUpperCase() + data.lastName.slice(1),
      })
    );
  };

  const [showPassword, setshowPassword] = useState(false);
  const [type, settype] = useState('password');
  const togglePasswordView = () => {
    if (!showPassword) {
      setshowPassword(true);
      settype('text');
    } else {
      setshowPassword(false);
      settype('password');
    }
  };

  const registerError = useAppSelector((state) => state.user.registerError);

  return (
    <>
      <div className='h-screen flex justify-center items-center'>
        <div className='mx-auto flex flex-col max-w-md px-4 py-8 bg-white rounded-lg sm:drop-shadow sm:px-6 md:px-8 lg:px-10 '>
          <div className='flex justify-center items-center mb-5'>
            <div className=' w-24 h-24 bg-red-600 flex justify-center items-center text-white rounded-full'>
              <span>Gangotri</span>
            </div>
          </div>
          <div className='self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl'>Create a new account</div>
          <span className='justify-center text-sm text-center text-gray-500 flex-items-center'>
            Already have an account ?
            <Link to={routes.login.path} className='ml-2 text-sm text-gray-500 underline hover:text-black'>
              Sign in
            </Link>
          </span>
          <div className='mt-8'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className='flex gap-4 mb-2'>
                <div className=' relative '>
                  <InputFieldComponent
                    icon={<NameIcon width='15' height='15' />}
                    name='firstName'
                    type={'text'}
                    placeholder={'First Name'}
                    register={register('firstName')}
                  />
                  {errors.firstName && <span className='text-xs text-red-500 '>{errors.firstName.message}</span>}
                </div>
                <div className='relative '>
                  <InputFieldComponent
                    icon={<NameIcon width='15' height='15' />}
                    name='lastName'
                    type={'text'}
                    placeholder={'Last Name'}
                    register={register('lastName')}
                  />
                  {errors.lastName && <span className='text-xs text-red-500'>{errors.lastName.message}</span>}
                </div>
              </div>
              <div className='flex flex-col mb-2'>
                <div className=' relative '>
                  <InputFieldComponent
                    icon={<EmailIcon2 width='15' height='15' />}
                    name='email'
                    type={'text'}
                    placeholder={'Email'}
                    register={register('email')}
                  />
                  {errors.email && <span className='text-xs text-red-500'>{errors.email.message}</span>}
                </div>
              </div>
              <div className='flex flex-col mb-2'>
                <div className=' relative '>
                  <InputFieldComponent
                    icon={<PhoneIcon width='15' height='15' />}
                    name='phone'
                    type={'number'}
                    placeholder={'Phone'}
                    register={register('phone')}
                  />
                  {errors.phone && <span className='text-xs text-red-500'>{errors.phone.message}</span>}
                </div>
              </div>
              <div className='flex flex-col mb-2'>
                <div className=' relative '>
                  <InputFieldComponent
                    icon={<AddressIcon width='15' height='15' />}
                    name='address'
                    type={'text'}
                    placeholder={'Address'}
                    register={register('address')}
                  />
                  {errors.address && <span className='text-xs text-red-500'>{errors.address.message}</span>}
                </div>
              </div>
              <div className='flex flex-col mb-2'>
                <div className='relative '>
                  <InputFieldComponent
                    icon={<LockIcon width='15' height='15' />}
                    name='password'
                    type={type}
                    placeholder={'Password'}
                    register={register('password')}
                  />
                  <div onClick={togglePasswordView} className='absolute right-2 opacity-50 top-3 cursor-pointer'>
                    {!showPassword ? <EyeIcon width='18' height='18' /> : <EyeSlashIcon width='18' height='18' />}
                  </div>
                  {errors.password && <span className='text-xs text-red-600'>{errors.password.message}</span>}
                </div>
              </div>
              {registerError && (
                <div className=' bg-red-500 text-white py-2 px-4 rounded-lg text-center'>{registerError}</div>
              )}
              <div className='flex w-full my-4 justify-center items-center'>
                <ButtonComponent2 disabled={!isValid} type='submit' color='black'>
                  Register
                </ButtonComponent2>
              </div>
              <div className='flex justify-end'>
                <input
                  type='button'
                  value='Reset'
                  onClick={() => reset()}
                  className='text-gray-500 text-sm font-light hover:underline hover:text-gray-700 cursor-pointer'
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
