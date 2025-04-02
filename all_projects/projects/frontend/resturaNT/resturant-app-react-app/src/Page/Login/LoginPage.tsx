/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import routes from '../../Lib/Routes/Routes';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import TextFieldComponent from '../../Components/TextField/TextFieldComponent';
import EmailIcon2 from '../../Icons/Email-Icon2';
import LockIcon from '../../Icons/Lock-Icon';
import EyeIcon from '../../Icons/Eye-Icon';
import EyeSlashIcon from '../../Icons/EyeSlash-Icon';
import { LoginSubmitForm } from '../../Lib/Interface/User/UserSubmitInterface';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../Lib/Store/User/User.Slice';
import ButtonComponent2 from '../../Components/Button/ButtonComponent2';
import { useAppSelector } from '../../Lib/Store/hooks';

export default function LoginPage() {
  const LoginSchema = yup.object({
    email: yup.string().email('Email must be a valid email').required('Enter a valid email'),
    password: yup.string().required('Enter a valid password'),
  });

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<LoginSubmitForm>({
    mode: 'onChange',
    resolver: yupResolver(LoginSchema)
  });

  const onSubmit = async (data: LoginSubmitForm) => {
    dispatch(userSliceActions.login(data));
    reset();
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

  const loginError = useAppSelector((state) => state.user.loginError);

  return (
    <div className='h-screen flex justify-center items-center'>
      <div className='mx-auto flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg sm:drop-shadow  sm:px-6 md:px-8 lg:px-10'>
        <div className='flex justify-center items-center mb-5'>
          <div className=' w-24 h-24 bg-red-600 flex justify-center items-center text-white rounded-full'>
            <span>Gangotri</span>
          </div>
        </div>
        <div className='self-center text-xl font-light text-gray-600 sm:text-2xl '>Login To Your Account</div>
        <div className='mt-8'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextFieldComponent
              name='email'
              icon={<EmailIcon2 width='15' height='15' />}
              placeholder='Your email'
              register={register('email')}
            />
            {errors.email && <span className='text-xs text-red-500'>{errors.email.message}</span>}
            <div className='relative'>
              <TextFieldComponent
                name='password'
                icon={<LockIcon width='15' height='15' />}
                placeholder='Your password'
                type={type}
                register={register('password')}
              />
              <div onClick={togglePasswordView} className='absolute opacity-60 right-2 top-3 cursor-pointer'>
                {!showPassword ? <EyeIcon width='18' height='18' /> : <EyeSlashIcon width='18' height='18' />}
              </div>
            </div>
            {errors.password && <span className='text-xs text-red-500'>{errors.password.message}</span>}
            {loginError && <div className=' bg-red-500 text-white py-2 px-4 rounded-lg text-center'>{loginError}</div>}
            <div className='flex items-center mb-6 mt-4'>
              <div className='flex ml-auto'>
                <Link
                  to={routes.forgetPassword.path}
                  className='inline-flex text-xs font-light text-gray-500 sm:text-sm  hover:text-black hover:underline'>
                  Forgot Your Password?
                </Link>
              </div>
            </div>
            <div className='flex w-full'>
              <ButtonComponent2 disabled={!isValid} loading={false} type='submit' color={'black'}>
                Login
              </ButtonComponent2>
            </div>
          </form>
        </div>
        <div className='flex items-center justify-between  mt-6'>
          <Link
            to={routes.register.path}
            className='inline-flex items-center text-sm font-light text-center text-gray-500 hover:text-gray-700 hover:underline'>
            <span className='ml-2'>You don&#x27;t have an account?</span>
          </Link>
          <span
            className=' text-gray-500 text-sm font-light hover:underline hover:text-gray-700 cursor-pointer'
            onClick={() => reset()}>
            Reset
          </span>
        </div>
      </div>
    </div>
  );
}
