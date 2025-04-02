import React from 'react';
import Logo from 'assets/images/logo.svg';

export default function ForgetPasswordHeader({ className }: { className?: string }) {
  return (
    <div
      className={` bg-black w-100 md:h-80 flex  
      justify-center items-center p-10 md:py-14 xl:py-24 sm:px-10 ${className}`}>
      <img src={Logo} alt="logo" className="inline-block object-contain max-w-1/2 md:max-w-full" />
    </div>
  );
}
