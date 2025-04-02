import React from 'react';

export default function MetaDataElement({
  title,
  children,
  loading,
}: {
  title: string;
  children: JSX.Element;
  loading: boolean;
}) {
  return (
    <>
      <div className='flex px-3 items-center justify-between w-full md:w-auto'>
        <span className='font-medium text-base text-slate-800'>{title}</span>
        {loading ? <div className='h-8 w-12 rounded-full animate-pulse bg-slate-200 ml-2'></div> : children}
      </div>
    </>
  );
}
