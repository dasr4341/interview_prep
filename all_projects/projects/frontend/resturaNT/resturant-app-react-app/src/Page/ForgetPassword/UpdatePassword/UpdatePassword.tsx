import ButtonComponent from '../../../Components/Button/ButtonComponent';
import TextFieldComponent from '../../../Components/TextField/TextFieldComponent';
import EmailIcon from '../../../Icons/Email-Icon';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import routes from '../../../Lib/Routes/Routes';
import { UpdateForgetPasswordFormSubmit } from '../../../Lib/Interface/User/UserInterface';
import Message from '../../../Components/Message/Message';
import CompanyIcon from '../../../Icons/Company-icon';
import { useAppDispatch, useAppSelector } from '../../../Lib/Store/hooks';
import { userSliceActions } from '../../../Lib/Store/User/User.Slice';
import { yupResolver } from '@hookform/resolvers/yup';
import { UpdatePasswordYupSchema } from './UpdatePasswordYupSchema';


export default function ForgetPassWordPage() {
  const dispatch = useAppDispatch();
  const updateForgetPasswordState = useAppSelector((state) => state.user.updateForgetPassword);

  // getting the token from the url
  const { token } = useParams();

  const defaultValues = {
    forgetPasswordAuthToken: token,
    newPassword: '',
    confirmPassword: '',
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UpdateForgetPasswordFormSubmit>({
    defaultValues: defaultValues,
    resolver: yupResolver(UpdatePasswordYupSchema),
  });

  const onSubmit = async (payload: any) => {
    const { confirmPassword, ...data } = payload;
    // setting the forget password loading state -> it will show the loader in submit button 
    dispatch(userSliceActions.setUpdateForgetPassword({ loading: true }));
    // sending the token and new password to the server
    dispatch(userSliceActions.updateForgetPassword(data));
  };

  return (
    <div className='mx-auto flex flex-col w-4/5  md:w-2/4 absolute transform translate-y-501 translate-x-501 top-1/2 left-1/2  max-w-md px-4 py-8 bg-white rounded-lg shadow-xl  sm:px-6 md:px-8 lg:px-10'>
      <CompanyIcon w='full' p='3' />

      <div className='self-center  mt-4 md:text-xl font-bold tracking-wide text-zinc-800 sm:text-2xl text-center text-base'>
        Reset Your Password
      </div>
      <div className='text-md text-slate-500 text-center mb-6 mt-2 text-xs md:text-base'>
        Enter new password to update your password
      </div>
      <div className='mt-8'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextFieldComponent
            icon={<EmailIcon />}
            placeholder='forgetPasswordAuthToken'
            register={register('forgetPasswordAuthToken')}
            iconType='hidden'
            extraStyle='hidden'
          />

          <TextFieldComponent
            icon={<EmailIcon />}
            placeholder='Enter new password'
            register={register('newPassword')}
            iconType='hidden'
          />
          <Message bgNone={true}>{errors.newPassword?.message}</Message>

          <TextFieldComponent
            icon={<EmailIcon />}
            placeholder='Re - Enter your password'
            register={register('confirmPassword')}
            iconType='hidden'
          />
          <Message bgNone={true}>{errors.confirmPassword?.message}</Message>

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
            <ButtonComponent type='submit' loading={updateForgetPasswordState.loading} color='black'>
              SUBMIT
            </ButtonComponent>
          </div>

          <div className='flex justify-between items-center mt-1'>
            <div className='flex'>
              <Link
                to={routes.register.path}
                className='inline-flex text-xs font-thin text-gray-500 sm:text-sm  hover:text-gray-700 hover:underline'>
                Don't have a account ? Register
              </Link>
            </div>
            <div onClick={() => reset()} className='inline-flex text-xs font-thin text-gray-500 sm:text-sm  hover:text-gray-700 hover:underline'>
              Reset
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
