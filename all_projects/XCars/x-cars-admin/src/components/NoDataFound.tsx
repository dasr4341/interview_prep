import React from 'react';

export default function NoDataFound({ message }: { message: string }) {
  return (
    <div className=" break-keep text-center  py-8 text-medium font-normal text-gray-400 tracking-widest">
      {message}
    </div>
  );
}
