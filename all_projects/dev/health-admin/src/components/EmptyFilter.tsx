import React from 'react';
import emptyImg from 'assets/images/empty-filters.svg';

export default function EmptyFilter({ allowLabel } : { allowLabel?: string }) {
  return (
    <div className="flex flex-col flex-1 items-center justify-center max-w-sm m-auto">
      <img src={emptyImg} alt="note icon" />
      <h1 className="h1 leading-tight my-3 text-center text-primary" data-testid="no-events-text">No results</h1>
      <p className="text-xmd leading-tight text-primary mb-10 text-center pb-2.5">
        {allowLabel ? allowLabel : 'Refine your search and try again'}
      </p>
    </div>
  );
}
