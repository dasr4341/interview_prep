import React from 'react';
import { Loader } from '@mantine/core';
import '../components/_form-submitted-row.scoped.scss';

export default function PdfDownloadLoading({ cancelDownload }: { cancelDownload: ()=> void }) {
  return (
    <section className="pdf-loading-screen ">

      <div>
        <button className=' text-pt-secondary text-base font-medium self-end' onClick={() => cancelDownload()}>Cancel</button>
        <div className='p-6 pb-8 flex justify-center flex-col items-center'>
        <Loader />
        <div className=" font-semibold mt-6 text-xsmd" >Downloading PDF </div>
        <div className=" text-gray-150 tracking-wider text-sm ">Please wait</div>
      </div>
      </div>
    </section>
  );
}
