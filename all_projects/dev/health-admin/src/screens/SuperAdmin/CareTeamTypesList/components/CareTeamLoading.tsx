import { range } from 'lodash';
import React from 'react';

const Loader = () => <div className="flex flex-col md:flex-row  space-y-3 md:space-y-0 md:space-x-6 w-full md:items-center ">
  <div className="  font-bold text-base md:w-3/12 capitalize h-12 animate-pulse bg-gray-300 "></div>
  <input
    type="email"
    className={'rounded md:w-5/12 border-gray-200 p-4 h-12 animate-pulse bg-gray-300'}
  />
</div>;

export default function CareTeamLoading() {
  return (
    <div className=" flex flex-col w-full space-y-8">
       <React.Fragment>
          { range(0, 5).map(el => (
           <div key={el}><Loader /></div>
          )) }
        </React.Fragment>
    </div>
  );
}
