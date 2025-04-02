import React from 'react';

export default function CarDetailsSkeletonLoader() {
  return (
    <section className=" grid grid-cols-12 md:px-8 p-1 gap-6 lg:w-10/12 w-full mx-auto mt-20">
      <div className=" lg:col-span-7 col-span-12 justify-center  animate-pulse bg-gray-300 rounded-md h-[450px]"></div>
      <div className=" lg:col-span-5 col-span-12 flex flex-col gap-6 ">
        <div className=" animate-pulse bg-gray-300  rounded-md h-12 w-full"></div>
        <div className="flex flex-row flex-wrap item-center gap-3">
          <div className=" animate-pulse bg-gray-300 rounded-md h-6 w-1/6"></div>
          <div className=" animate-pulse bg-gray-300 rounded-md h-6 w-1/6"></div>
          <div className=" animate-pulse bg-gray-300 rounded-md h-6 w-1/6"></div>
          <div className=" animate-pulse bg-gray-300 rounded-md h-6 w-1/6"></div>
          <div className=" animate-pulse bg-gray-300 rounded-md h-6 w-1/6"></div>
          <div className=" animate-pulse bg-gray-300 rounded-md h-6 w-1/6"></div>
          <div className=" animate-pulse bg-gray-300 rounded-md h-6 w-1/6"></div>
        </div>
        <div className=" flex gap-3 flex-col ">
          <div className=" animate-pulse bg-gray-300  rounded-md h-4 w-full"></div>
          <div className=" animate-pulse bg-gray-300  rounded-md h-4 w-full"></div>
          <div className=" animate-pulse bg-gray-300  rounded-md h-4 w-full"></div>
        </div>

        <div className=" self-end items-end  animate-pulse bg-gray-300  rounded-md h-12 w-full"></div>
      </div>
    </section>
  );
}
