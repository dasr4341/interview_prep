import React from 'react';
import ButtonComponent from '../../../Components/Button/ButtonComponent';
import TextFieldComponent from '../../../Components/TextField/TextFieldComponent';
import EmailIcon from '../../../Icons/Email-Icon';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../../Lib/Store/hooks';
import { userSliceActions } from '../../../Lib/Store/User/User.Slice';
import { Link } from 'react-router-dom';
import routes from '../../../Lib/Routes/Routes';
import { ForgetPasswordPayload } from '../../../Lib/Api/Fake/Users/users.interface';
import Message from '../../../Components/Message/Message';

export default function ForgetPassWordPage() {
  const forGetPasswordState = useAppSelector(state => state.user.forgetPassword);
  const dispatch  = useAppDispatch();

  const {
    register,
    handleSubmit,
  } = useForm<ForgetPasswordPayload>();
  
  const onSubmit = (data: ForgetPasswordPayload) => {
    dispatch(userSliceActions.forgetPassword(data));
  };

  return (
    <div className='mx-auto flex flex-col w-full max-w-md px-4 py-8 bg-white rounded-lg shadow  sm:px-6 md:px-8 lg:px-10'>
      <div className='self-center mb-6 text-xl font-light text-gray-600 sm:text-2xl '>Forget your password?</div>
      <div className='mt-8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextFieldComponent icon={<EmailIcon />} placeholder='Your email' register={register('username')} />
          <div className='flex items-center mb-6 mt-4'>
            <div className='flex ml-auto'>
              <div  className='inline-flex text-xs font-thin text-gray-500 sm:text-sm  hover:text-gray-700'>
                Already have password <Link to={routes.login.path} className="ml-1 underline"> login</Link>
              </div>
            </div>
          </div>
          <div className='flex w-full'>
            <ButtonComponent testId='login' type='submit' loading={forGetPasswordState.loading}>Login</ButtonComponent>
          </div>
        </form>
        {forGetPasswordState.token && (
          <Message>
            An email has been sent. Please Check your email
          </Message>
        )}
      </div>
    </div>
    
  );
}
