import React from 'react';

export default function Footer({ children }: { children: JSX.Element }) {
  return (
    <div className="space-y-6 flex flex-col py-10 bg-gray-50">
      <hr />
      <div className="flex flex-col max-w-sm md:w-96 md:mx-auto px-5">{children}</div>
    </div>
  );
}
