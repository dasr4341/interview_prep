import React, { useEffect, useState } from 'react';

export default function Message({ color, children }: { color?: 'blue' | 'red', children: any }) {
  const [colorClass, setMessageColor] = useState(
    'bg-blue-500  text-white '
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
    <div className={`container mt-2 flex items-center text-sm font-bold px-4 py-3 relative ${colorClass}`}>
      {children}
    </div>
  );
}
