import React from 'react';
import Logo from '../assets/images/logo.svg';

export default function LoginHeader({ className, title }: { className?: string;  title?: string }): JSX.Element {
  return (
    <div className={`${className} bg-black w-100 items-center p-10 md:pb-14 xl:pb-24 sm:px-10 flex flex-col justify-center`}>
      <img src={Logo} alt="logo" className="inline-block object-contain max-w-1/2 md:max-w-full" />
      {title && <div className=' text-white mt-4 font-medium text-sm text-center md:text-smd'>{title}</div>}
    </div>
  );
}
