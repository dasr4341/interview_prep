import React from 'react';
import MetaDataElement from './MetaDataElement';
import { MetaDataInterface } from 'Interface/MetaDataInterface';

export default function CompilationMetaData({ metaData }: { metaData: MetaDataInterface }) {
  return (
    <section
      className='md:divide-x py-2 md:divide-slate-600 flex flex-col md:flex-row
          md:justify-center md:items-center justify-start items-start
          mt-8 mb-4
          w-full 
           md:px-0
          space-y-3 md:space-y-0'>
      <MetaDataElement title='Status' loading={metaData.loading}>
        <button
          className={
            metaData.data?.status == 'ONGOING'
              ? 'font-medium text-sm py-1 capitalize bg-[#CDE2FF] px-3 rounded-2xl mx-2'
              : 'font-medium text-sm py-1 capitalize bg-[#c9cdd2] px-3 rounded-2xl mx-2'
          }>
          {metaData.data?.status == 'ONGOING' ? 'Active Ads' : 'No Active Ads'}
        </button>
      </MetaDataElement>
      <MetaDataElement title='Tiles' loading={metaData.loading}>
        <button className='font-medium text-sm py-1 bg-[#c9cdd2] text-black px-3 rounded-2xl mx-2'>
          {metaData.data?.tile_count || 0}
        </button>
      </MetaDataElement>
      <MetaDataElement title='Captions' loading={metaData.loading}>
        <button className='font-medium text-sm py-1 bg-[#c9cdd2] text-black px-3 rounded-2xl mx-2'>
          {metaData.data?.caption_count || 0}
        </button>
      </MetaDataElement>
      <MetaDataElement title='Total Spend' loading={metaData.loading}>
        <button className='font-medium text-sm py-1 bg-[#c9cdd2] text-black px-3 rounded-2xl mx-2'>
          {metaData.data?.total_spent}
        </button>
      </MetaDataElement>
    </section>
  );
}
