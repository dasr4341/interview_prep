import React from 'react';
import ReportDetailsScale from 'components/icons/ReportDetailsScale';
import ReportScaleEllipse from './ReportScaleEllipse';

export default function biometricScale({ scale }: { scale: number }) {
  function reportValue(value: number) {
    switch (value) {
      case -3:
        return 'first-item';
      case -2:
        return 'second-item';
      case -1:
        return 'third-item';
      case 0:
        return 'fourth-item';
      case 1:
        return 'fifth-item';
      case 2:
        return 'sixth-item';
      case 3:
        return 'seventh-item';
      default:
        return 'third-item';
    }
  }

  return (
    <div className="flex flex-1 mb-5 md:mb-0 sm:absolute right-5 md:right-8 xl:right-20 top-2 md:top-4 xl:top-12">
      <div className="relative">
        <ReportDetailsScale />
        <ReportScaleEllipse
         className={`absolute top-0 -mt-1.5 ${reportValue(isNaN(scale) ? 0 : scale)}`}
        />
        <div className="absolute text-center font-bold text-xss capitalize text-black-600 top-10 left-14">
          Trending <br /> Biometrics <br />
          Scale
        </div>
      </div>
    </div>
  );
}

