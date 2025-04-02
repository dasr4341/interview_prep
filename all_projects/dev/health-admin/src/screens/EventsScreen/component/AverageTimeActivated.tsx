import React from 'react';
import average_time_activated from '../../../assets/health-icons/average_time_activated.svg';
import Average_Time_Activated_Frame from '../../../assets/health-icons/Average_Time_Activated_Frame.svg';

export default function AverageTimeActivated() {
  return (
    <>
      <div className="flex justify-between">
        <div className='flex items-center'>
          <div className="flex-none bg-yellow-500 rounded p-2 filter drop-shadow-xl">
            <img src={ average_time_activated } alt='Step Icon' className='w-5.5'/>
          </div>
          <div className="grow">
            <p className='text-primary font-normal text-sm px-3 '>Your daily average for the past 30 days: 93</p>
          </div>
        </div>
        <div className="order-last"><p className='bg-gray-300 rounded py-2 leading-none px-3 text-sm md:text-base min-w-5'>-2 SP02</p></div>
      </div>

      <div className='graph-place mt-5'>
        <div className="w-full">
          <img className='w-full h-auto' src={ Average_Time_Activated_Frame } alt='Sleep_minutes_frame' />
        </div>
      </div>
    </>
  );
}
