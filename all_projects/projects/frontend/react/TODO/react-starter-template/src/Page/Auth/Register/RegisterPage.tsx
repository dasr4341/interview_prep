/* eslint-disable max-len */
import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../../../Lib/Routes/Routes';
import ButtonComponent from '../../../Components/Button/ButtonComponent';

export default function RegisterPage() {
  return (
    <div className='mx-auto flex flex-col max-w-md px-4 py-8 bg-white rounded-lg shadow  sm:px-6 md:px-8 lg:px-10'>
      <div className='self-center mb-2 text-xl font-light text-gray-800 sm:text-2xl'>
        Create a new account
      </div>
      <span className='justify-center text-sm text-center text-gray-500 flex-items-center'>
        Already have an account ?
        <Link to={routes.login.path} className='ml-2 text-sm text-blue-500 underline hover:text-blue-700'>
          Sign in
        </Link>
      </span>
      <div className='p-6 mt-8'>
        <form>
          <div className='flex gap-4 mb-2'>
            <div className=' relative '>
              <input
                type='text'
                id='create-account-first-name'
                className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                name='First name'
                placeholder='First name'
              />
            </div>
            <div className=' relative '>
              <input
                type='text'
                id='create-account-last-name'
                className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                name='Last name'
                placeholder='Last name'
              />
            </div>
          </div>
          <div className='flex flex-col mb-2'>
            <div className=' relative '>
              <input
                type='text'
                id='create-account-email'
                className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                placeholder='Email'
              />
            </div>
          </div>

          <div className='flex flex-col mb-2'>
            <div className='relative '>
              <input
                type='password'
                id='create-account-pseudo'
                className=' rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent'
                placeholder='Password'
              />
            </div>
          </div>
          <div className='flex w-full my-4'>
            <ButtonComponent>
              Register
            </ButtonComponent>
          </div>
        </form>
      </div>
    </div>
  );
}
