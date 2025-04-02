import React from 'react';
import NotFoundIcon from './icons/NotFoundIcon';

export default function NoDataFound({ type, heading, content }: { type: 'SEARCH' | 'NODATA'; heading?: string; content?: string }) {
  return (
    <div className="flex flex-col justify-center items-center w-fit  text-primary mx-auto ">
      {/* we have two types of icons  */}
      {/* 1. NODATA: No data is found initially */}
      {/* 2. SEARCH: if we don't get our searched data from api */}
      {type === 'NODATA' ? (
        <NotFoundIcon type="NODATA" className="md:w-32 md:h-32 w-16 h-16" />
      ) : (
        <NotFoundIcon type="SEARCH" className="md:w-28 md:h-28 w-16 h-16" />
      )}
      <div className={'md:text-lg text-xsmd font-bold mt-4'} data-testid="no-results">
        {heading ? heading : 'No Data Found!'}
      </div>
      <div className="font-normal md:text-xmd text-center text-xs mt-2 pb-2.5" data-testid="refine-search">
        {content}
      </div>
    </div>
  );
}
