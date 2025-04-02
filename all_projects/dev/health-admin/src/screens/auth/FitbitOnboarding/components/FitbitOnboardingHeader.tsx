import React, { ReactNode } from 'react';

import Logo from '../../../../assets/images/logo.svg';

export default function FitbitOnboardingHeader({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={`${className} bg-black w-100 items-end pb-8 pt-10 lg:pt-20`}>
      <div className="flex justify-center">
        <img src={Logo} alt="logo" className="inline-block object-contain max-w-1/2 md:max-w-full" />
      </div>
      {children && <div className="font-semibold text-white text-smd text-center pt-4">{children}</div>}
    </div>
  );
}
