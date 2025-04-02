import React from 'react';
import ButtonComponent from '../../../Components/Button/ButtonComponent';
import TextFieldComponent from '../../../Components/TextField/TextFieldComponent';
import EmailIcon from '../../../Icons/Email-Icon';
import LockIcon from '../../../Icons/Lock-Icon';
import { useForm } from 'react-hook-form';
import { LoginPayload } from '../../../Lib/Api/Fake/Users/users.interface';
import { useAppDispatch, useAppSelector } from '../../../Lib/Store/hooks';
import { userSliceActions } from '../../../Lib/Store/User/User.Slice';
import { Link } from 'react-router-dom';
import routes from '../../../Lib/Routes/Routes';

export default function LoginPage() {
  const loginState = useAppSelector(state => state.user.login);
  const dispatch  = useAppDispatch();

  const {
    register,
    handleSubmit,
  } = useForm<LoginPayload>();
  
  const onSubmit = (data: LoginPayload) => {
    dispatch(userSliceActions.login(data));
  };

  return (
    <div className='mx-auto flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow  sm:px-6 md:px-8 lg:px-10'>
      <div className='self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl '>Login To Your Account</div>
      <div className='mt-8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextFieldComponent icon={<EmailIcon />} placeholder='Your email' register={register('username')} />
          
          <TextFieldComponent icon={<LockIcon />} placeholder='Your password' type='password' register={register('password')} />
          <div className='flex items-center mb-6 mt-4'>
            <div className='flex ml-auto'>
              <Link to={routes.forgetPassword.path}
               className='inline-flex text-xs font-thin text-gray-500 sm:text-sm  hover:text-gray-700'>
                Forgot Your Password?
              </Link>
            </div>
          </div>
          <div className='flex w-full'>
            <ButtonComponent type='submit' loading={loginState.loading}>Login</ButtonComponent>
          </div>
        </form>
      </div>
      <div className='flex items-center justify-center mt-6'>
        <Link
          to={routes.register.path}
          className='inline-flex items-center text-xs font-thin text-center text-gray-500 hover:text-gray-700'>
          <span className='ml-2'>You don&#x27;t have an account?</span>
        </Link>
      </div>
    </div>
    
  );
}
