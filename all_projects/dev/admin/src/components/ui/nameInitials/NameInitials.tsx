import React from 'react';

export default function NameInitials({
  name, className
}: {
  name: string | null | undefined;
  className?: string
}) {
  return (
    <div className="relative inline-block flex-none" data-testid="nameInitials">
      <span data-testid="nameInitials-span"
        className={`flex items-center justify-center px-1 overflow-hidden
         bg-gray-600 text-white rounded-full
         ${className ? className : 'w-12 h-12'}
        `}>
        <span>
          {name
            ? name
              .split(' ')
              .map((c) => c.substring(0, 1))
              .join('')
            : ''}
        </span>
      </span>
    </div>
  );
}
