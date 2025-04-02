import React from 'react';
import _ from 'lodash';
import { BsThreeDots } from 'react-icons/bs';

export default function SurveyTemplateListRowSkeletonLoading({
  numberOfRow,
  className
}: {
  numberOfRow: number;
  className?: string
}) {

  return (
    <>
      {
        _.range(0, numberOfRow).map((item) => (
          <div className={` ${className} block py-7 px-5 border-b border-gray-100 relative bg-white`} key={item}>
            <div className="flex items-between space-x-4">
               <div className=" flex justify-start w-full space-x-4">
                <div className={`row-header font-bold text-base bg-gray-100 h-4 animate-pulse ${location.pathname.includes('mobile-template/standard') ?
                  'w-2/4' : 'w-7/12'}`}>
                </div>
                {location.pathname.includes('mobile-template/standard') && (
                  <div className="row-header font-bold text-base bg-gray-100 h-4 animate-pulse w-1/5"></div>
                )}
                <div className={`row-header font-bold  h-4 animate-pulse bg-gray-100 text-base ${location.pathname.includes('mobile-template/standard') ?
                  'w-1/5' : 'w-3/12'}`}></div>
                <div className="row-header font-bold text-base right-gap w-1/12 justify-center flex" > <div className=' w-12 h-4 rounded-full bg-gray-300 animate-pulse'></div></div>
                {location.pathname.includes('mobile-template/standard') && <div className="row-header font-bold text-base right-gap w-1/12" />}
                <div className="row-header right-gap w-1/12 text-gray-600 " > <BsThreeDots /></div>
            </div>
            </div>
          </div>
        ))
      }
    </>
  );
}
