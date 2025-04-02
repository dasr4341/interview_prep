import React from 'react';

function OrderStatusSkeletonLoading() {
  return (
    <section className='flex pb-8 md:w-[90%] gap-2 m-auto justify-center top-0'>
      {/* card */}
      <div className=' bg-white md:w-[50%] w-full rounded flex flex-col p-2 '>
        <div className='flex justify-between items-start p-2 '>
          <div className='flex flex-col w-full'>
            <span className='flex items-center font-semibold h-8 bg-slate-300 w-[50%] rounded animate-pulse'>
            </span>
            <span className='text-xs font-light h-4 bg-slate-300 animate-pulse mt-2 w-20 rounded'>
            </span>
            <span className='text-xs font-light h-4 bg-slate-300 animate-pulse mt-2 w-20 rounded'>
            </span>
           
            <div className='mt-6 '>
              <div className='flex items-center justify-between w-full bg-slate-300 animate-pulse py-1 px-2 rounded  hover:cursor-pointer ' >
                <span className='text-xs font-light h-4 bg-slate-300 animate-pulse mt-2 w-20 rounded'>
                </span>
              </div>
              

              <div className='bg-theme-bg animate-pulse rounded p-1 mt-2  text-sm md:text-base h-40 '>
               
              </div>

            </div>

          </div>

        </div>

        <hr />
        <div className='p-2 gap-y-8 grid grid-cols-5 justify-items-start items-center self-start '>

        </div>
        <div className=' bg-slate-700 w-full text-sm p-2 mt-4 rounded text-white tracking-wider font-light'>
          For any kind of query can contact out customer executive at --&nbsp;<a href={`tel:+91${process.env.REACT_APP_CUSTOMER_CARE}`}> <span className='text-white font-bold'>+91{process.env.REACT_APP_CUSTOMER_CARE}</span></a>
        </div>

      </div>

    </section>
  );
}

export default OrderStatusSkeletonLoading;