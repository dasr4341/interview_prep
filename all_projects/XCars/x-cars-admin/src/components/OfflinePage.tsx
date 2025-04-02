import React from 'react';
function OfflinePage() {
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 p-4 w-10/12 md:w-1/2 rounded-xl  ">
      <div className=" text-gray-800 text-[80px] font-extrabold ">OPPS !</div>
      <div className=" text-orange-500 font-bold text-sm ">You are offline</div>
      <div className=" text-xl text-gray-700  text-justify">
        WIFI and mobile data are turned off. Please check your network
        connectivity
      </div>
    </div>
  );
}

export default OfflinePage;
