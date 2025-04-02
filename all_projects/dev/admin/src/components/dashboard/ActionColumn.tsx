import React from 'react';

export default function ActionColumn({ icon, num, text }: { icon?: string; num: number | string; text: string }) {
  return (
    <div
      className="flex flex-row mt-7 w-full
    border-l border-gray-600 first:border-0 first:border-l-0
    pl-6 first:pl-0">
      {/* <img src={LinkedInIcon} className="w-4" /> */}

      {icon && (
        <div
          className="flex justify-center	
            mr-6 bg-gray-200 w-10 h-10 rounded-full">
          <img src={icon} className="w-4" />
        </div>
      )}

      <div className="flex flex-col">
        <span
          className="text-primary-light font-extrabold
    text-md ">
          {num}
        </span>
        <span className="text-gray-600 text-xs font-medium">{text}</span>
      </div>
    </div>
  );
}
