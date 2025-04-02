import React from 'react';

export default function GroupPermissionList({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={`pb-2 pt-4 border-b border-gray-300 ${className}`}>
      <h3 className="h3">
        {title}
        {children}
      </h3>
    </div>
  );
}
