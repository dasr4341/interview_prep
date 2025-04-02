import React from 'react';
import UrlIcon from 'components/icons/Uri';

export default function InTheNews({ data }: { data: any }) {
  return (
    <div className="bg-white text-primary px-5 py-6 border border-gray-200 rounded-xl">
      <h3 className="font-medium text-xs text-primary opacity-50 mb-1 uppercase">Source Company</h3>
      <div className="flex justify-between text-primary">
        <div className="flex items-center">
          <span>{data?.sourceCompany || 'NA'}</span>
          <a href={data?.newsUrl} target="_blank" className="text-base ml-3 text-pt-blue-300">
            <UrlIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
