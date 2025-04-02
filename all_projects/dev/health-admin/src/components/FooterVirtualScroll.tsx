import React from 'react';

export default function FooterVirtualScroll({ noMoreData, list }: { noMoreData: boolean; list: Array<unknown> }) {
  return (
    <div className='text-center py-4 text-gray-150'>
      {!noMoreData && list.length > 0 && (
        <>Loading ...</>
      )}
      {noMoreData && list.length > 0 && (
        <>No more data!</>
      )}
    </div>
  );
}
