/* eslint-disable react-hooks/exhaustive-deps */
import { useAppSelector, useAppDispatch } from '../../../Lib/Store/hooks';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// import { ResetPasswordSubmitForm } from '../../../Lib/Interface/User/UserSubmitInterface';
import ResetPasswordSchema from './ResetPasswordSchema';

import { ResetPasswordPayLoad } from '../../../Lib/Interface/User/UserInterface';

import TextFieldComponent from '../../../Components/TextField/TextFieldComponent';
import ButtonComponent from '../../../Components/Button/ButtonComponent';
import { userSliceActions } from '../../../Lib/Store/User/User.Slice';
import Message from '../../../Components/Message/Message';



export default function ResetPassword() {
  const storeData = useAppSelector((state) => state);
  const user = storeData.user.currentUser;
  // const toastMessage = storeData.helper.toastMessage;
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordPayLoad>({
    resolver: yupResolver(ResetPasswordSchema),
  });

  const onFormSubmit = (data: ResetPasswordPayLoad) => {
    console.log(data);
    dispatch(userSliceActions.resetPassword(data));
  };
  // useEffect(() => {
      
  //     if (toastMessage.success  ) {
  //       toast.success(toastMessage.message);
  //     } else if (!toastMessage.success  ) {
  //       toast.error(toastMessage.message);
  //     }
  //     dispatch(helperSliceActions.setToastMessage({ message: null, success: false }));
    
  // }, [toastMessage.message]);

  return (
    <section className='h-screen w-full bg-gray-100 bg-opacity-50 pt-8'>
      <form
        className='container max-w-2xl mx-auto border-indigo-400  md:w-3/4 rounded-lg shadow-xl'
        onSubmit={handleSubmit(onFormSubmit)}>
        {/* <h1 className='text-left font-bold py-4 text-lg text-hColor'>Reset Password</h1> */}
        <div className='p-4 bg-gray-100 rounded-lg'>
          <div className='max-w-sm mx-auto md:w-full md:mx-0'>
            <div className='inline-flex items-center space-x-4'>
              <a href='#' className='block relative'>
                <img
                  alt='profile'
                  src={'img-placeholder-todo'}
                  className='mx-auto object-cover rounded-full h-16 w-16 '
                />
              </a>
              <h1 className='text-gray-600 '>
                {user?.name} 
              </h1>
            </div>
          </div>
        </div>

        <div className='space-y-6 bg-white'>
          <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
            <h2 className='max-w-sm mx-auto md:w-1/3'>Old Password</h2>
            <div className='max-w-sm mx-auto md:w-2/3'>
              <div className=' relative '>
                <TextFieldComponent
                  placeholder='Enter password to verify'
                  register={register('oldPassword')}
                  iconType='hidden'
                />
              </div>
              <Message bgNone={true}>{errors.oldPassword?.message}</Message>
            </div>
          </div>
          <hr />
          <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
            <h2 className='max-w-sm mx-auto md:w-1/3'>New Password</h2>
            <div className='max-w-sm mx-auto md:w-2/3'>
              <div className=' relative '>
                <TextFieldComponent
                  placeholder='Enter new password'
                  register={register('newPassword')}
                  iconType='hidden'
                />
              </div>
              <Message bgNone={true}>{errors.newPassword?.message}</Message>
            </div>
          </div>
          <hr />
          <div className='items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0'>
            <h2 className='max-w-sm mx-auto md:w-1/3'>Re - Enter Password</h2>
            <div className='max-w-sm mx-auto md:w-2/3'>
              <div className=' relative '>
                <TextFieldComponent
                  placeholder='Re - enter new password'
                  register={register('reEnterPassword')}
                  iconType='hidden'
                />
              </div>
              <Message bgNone={true}>{errors.reEnterPassword?.message}</Message>
            </div>
          </div>
          <hr />

          <div className='w-full px-4 pb-4  flex flex-col md:flex-row-reverse justify-start md:justify-between  items-center text-gray-500'>
            <ButtonComponent color='black' type='submit'>
              Save
            </ButtonComponent>
            <span
              className=' text-gray-500 text-sm font-light hover:underline hover:text-gray-700 cursor-pointer mt-2 md:mt-0'
              onClick={() => reset()}>
              Reset
            </span>
          </div>
        </div>
      </form>
    </section>
  );
}
