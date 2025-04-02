import React from 'react';
import Logo from '../assets/images/logo.svg';

export default function LoginHeader({ className }: { className?: string }): JSX.Element {
  return (
    <div
      className={`${className} bg-primary-light w-100 md:h-96 flex 
      justify-center items-end px-4 pb-8 md:pb-14 xl:pb-24`}>
      <img src={Logo} alt="logo" width="346" height="105" className="inline-block object-contain" />
    </div>
  );
}
