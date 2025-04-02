import React, { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import ErrorMessage from 'Components/Error/ErrorMessage';
import EyeIcon from 'Icons/EyeIcon';
import messageConfig from 'Lib/message';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { LoginInterface } from 'Interface/loginInterface';
import { snapActionsApi } from 'Lib/Api/snap-actions-api';
import { toast } from 'react-toastify';
import { setAuthToken } from 'Lib/HelperFunction/setAuthToken';
import { useNavigate } from 'react-router-dom';
import routes from 'Lib/Routes/Routes';
import { ImSpinner7 } from 'react-icons/im';

const loginSchema = Yup.object().shape({
  email: Yup.string().required(messageConfig.emailRequired),
  password: Yup.string().required(messageConfig.passwordRequired),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInterface>({
    mode: 'onChange',
    resolver: yupResolver(loginSchema),
  });

  async function onSubmit(loginData: LoginInterface) {
    setLoading(true);
    try {
      const { data } = await snapActionsApi.userLogin(loginData);
      /* This is a function that sets the token in the local storage and redirects to the compilation list page. */
      setAuthToken(data.access, data.refresh);
      setTimeout(() => {
        navigate(routes.compilationList.path);
      }, 1000);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className='absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center'>
      <form
        className='flex flex-col border border-1 rounded-md w-1/3 py-8 px-6 shadow-lg'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='text-4xl font-bold text-slate-900'>Login</div>
        <div className='p-4 border border-1 rounded mt-8 flex items-center justify-between'>
          <input
            {...register('email')}
            type='text'
            placeholder='Email'
            className='border-0 text-lg outline-none w-full'
          />
        </div>
        {errors?.email?.message && <ErrorMessage message={errors.email.message} />}
        <div className='p-4 border border-1 rounded mt-2 flex items-center justify-between'>
          <input
            {...register('password')}
            type={passwordVisibility ? 'text' : 'password'}
            placeholder='Password'
            className='border-0 text-lg outline-none w-11/12'
          />
          <button type='button' onClick={() => setPasswordVisibility(!passwordVisibility)}>
            {passwordVisibility ? (
              <EyeIcon type='open' className='h-5 w-6 text-slate-500' />
            ) : (
              <EyeIcon type='close' className='h-5 w-6 text-slate-500' />
            )}
          </button>
        </div>
        {errors?.password?.message && <ErrorMessage message={errors.password.message} />}

        <button
          disabled={loading}
          className={`flex items-center justify-center text-center tracking-wide p-3 text-white uppercase font-semibold mt-8 bg-blue bg-theme-color rounded ${
            loading && 'disabled'
          } `}>
          Submit
          {loading && <ImSpinner7 className='animate-spin ml-2' />}
        </button>
      </form>
    </section>
  );
}
