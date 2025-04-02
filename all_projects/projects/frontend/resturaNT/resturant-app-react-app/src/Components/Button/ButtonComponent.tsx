/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';

export default function ButtonComponent({
  loading,
  color,
  type,
  children,
  Logo,
  textStyle,
  onclick,
  disabledBtn,
  isFullWidth = true,
}: {
  loading?: boolean;
  color?: 'blue' | 'red' | 'black' | 'slate' | 'theme-btn-400' | any;
  type?: 'submit' | 'button';
  children: any;
  Logo?: JSX.Element;
  textStyle?: string;
  onclick?: () => void;
  disabledBtn?: boolean;
  isFullWidth?: boolean;
}) {
  const [buttonColor, setButtonColor] = useState('btn-black');

  useEffect(() => {
    if (color === 'black') {
      setButtonColor('bg-black hover:bg-zinc-800 focus:ring-black focus:ring-offset-black text-white');
    } else if (color === 'blue') {
      setButtonColor('bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white');
    } else if (color === 'slate') {
      setButtonColor('bg-slate-200 text-white');
    } else if (color === 'red') {
      setButtonColor('bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white');
    } else if (color === 'green') {
      setButtonColor('bg-green-400 hover:bg-green-500 text-white py-2 rounded tracking-wider');
    } else if (color === 'theme-btn-400') {
      setButtonColor('bg-theme-btn-400 hover:bg-theme-btn-500 text-white');
    }
  }, [color]);

  return (
    <>
      <button
        type={type || 'button'}
        disabled={disabledBtn}
        className={`py-2 px-5 flex justify-center items-center ${
          isFullWidth ? 'w-full' : ''
        }  transition ease-in duration-200 text-center text-xs md:text-sm font-semibold shadow-md rounded
      ${buttonColor}
      ${loading ? 'cursor-not-allowed' : ''}
      ${disabledBtn ? 'opacity-60' : ''}
      `}
        onClick={onclick}>
        <div className='md:block hidden'>{Logo}</div>

        <span className={`${textStyle}`}>{children}</span>
        {loading && (
          <svg
            width='20'
            height='20'
            fill='currentColor'
            className='ml-2 animate-spin'
            viewBox='0 0 1792 1792'
            xmlns='http://www.w3.org/2000/svg'>
            <path d='M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z'></path>
          </svg>
        )}
      </button>
    </>
  );
}
