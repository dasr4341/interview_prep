import React, { useEffect, useState } from 'react';

export default function Message({ color, children, bgNone }: { color?: 'blue' | 'red', children: any, bgNone?: boolean }) {

  const [colorClass, setMessageColor ] = useState(
    ` ${(bgNone) ? 'text-slate-200' : 'bg-green-100 text-zinc-800  px-4 py-2'}`
  );

  useEffect(() => {
    if (color === 'red') {
      setMessageColor(' bg-red-500  text-white ');
    } else if (color === 'blue') {
      setMessageColor(
        'bg-blue-500  text-white '
      );
    } 
  }, [color]);

  return (
    <div className={`container mt-2  px-2 mb-4 flex rounded items-center text-sm  relative ${colorClass}`}>
      {children}
    </div>
  );
}

