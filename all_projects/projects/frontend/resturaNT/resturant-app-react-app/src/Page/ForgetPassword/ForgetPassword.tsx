import ButtonComponent from '../../Components/Button/ButtonComponent';
import TextFieldComponent from '../../Components/TextField/TextFieldComponent';
import EmailIcon from '../../Icons/Email-Icon';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import routes from '../../Lib/Routes/Routes';
import { ForgetPasswordPayload } from '../../Lib/Interface/User/UserInterface';
import Message from '../../Components/Message/Message';
import CompanyIcon from '../../Icons/Company-icon';
import { useAppDispatch, useAppSelector } from '../../Lib/Store/hooks';
import { userSliceActions } from '../../Lib/Store/User/User.Slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { ForgetPasswordYupSchema } from './ForgetPasswordYupSchema';


export default function ForgetPassWordPage() {
  const forGetPasswordState = useAppSelector((state) => state.user.forgetPassword);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgetPasswordPayload>({
    resolver: yupResolver(ForgetPasswordYupSchema),
  });

  const onSubmit = async (data: ForgetPasswordPayload) => {
    // setting the forget password loading state -> it will show the loader in submit button 
    dispatch(userSliceActions.setForgetPassword({ loading: true }));
    // sending the email to the server
    dispatch(userSliceActions.forgetPassword(data));
  };

  return (
    <div className='mx-auto flex flex-col w-5/6  md:w-2/4 absolute transform translate-y-501 translate-x-501 top-1/2 left-1/2  max-w-md px-4 py-8 bg-white rounded-lg shadow-xl  sm:px-6 md:px-8 lg:px-10'>
      <CompanyIcon w='full' p='3' />

      <div className='self-center  mt-4 md:text-xl font-bold tracking-wide text-zinc-800 sm:text-2xl text-center text-base'>
        Reset Your Password
      </div>
      <div className='text-md text-slate-500 text-center mb-6 mt-2 text-xs md:text-base'>
        Enter email id associated with your account to receive email
      </div>
      <div className='mt-8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextFieldComponent
            icon={<EmailIcon />}
            placeholder='Enter your email'
            register={register('email')}
            iconType='hidden'
          />
          <Message bgNone={true}>{errors.email?.message}</Message>
          <div className='flex items-center mb-6 mt-1'>
            <div className='flex ml-auto'>
              <Link
                to={routes.login.path}
                className='inline-flex text-xs font-thin text-gray-500 sm:text-sm  hover:text-gray-700 hover:underline'>
                Click here to Login
              </Link>
            </div>
          </div>
          <div className='flex w-full mb-3'>
            <ButtonComponent type='submit' loading={forGetPasswordState.loading} color='black'>
              SUBMIT
            </ButtonComponent>
          </div>

          <div className='flex justify-between items-center mt-4'>
            <div className='flex'>
              <Link
                to={routes.register.path}
                className='inline-flex text-xs font-thin text-gray-500 sm:text-sm  hover:text-gray-700 hover:underline'>
                Don't have a account ? Register
              </Link>
            </div>
            <div
              onClick={() => reset()}
              className='inline-flex text-xs font-thin text-gray-500 sm:text-sm  hover:text-gray-700 hover:underline'>
              Reset
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
