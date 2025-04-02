import React from 'react';
import { OrderPage } from '../../Lib/Helper/constants';

function OrderSkeletonLoading({ pageType }: { pageType: string | undefined }) {
  return (
    <div className='bg-white flex flex-col p-4 rounded mb-4'>
      <div className='w-12 h-4 rounded-md animate-pulse bg-teal-300'></div>
      <div className='flex justify-between mt-4 gap-3 items-center'>
        {(pageType === OrderPage.ALL_ORDERS || pageType === OrderPage.READY_TO_DELIVER) &&  <div className='w-full h-3 rounded-md animate-pulse bg-teal-300'></div>}
        {(pageType === OrderPage.NEW_ORDER || pageType === OrderPage.PREPARATION ) && <div className='flex w-[60%]'>
          <div className='w-[50%] h-3 rounded-md animate-pulse bg-teal-300'></div>
          <div className='w-[50%] h-3 rounded-md animate-pulse bg-teal-300 ml-2'></div>
        </div>}
        <div className='w-10 h-2 bg-teal-200 rounded-md animate-pulse'></div>
      </div>
    </div>
  );
}

export default OrderSkeletonLoading;
