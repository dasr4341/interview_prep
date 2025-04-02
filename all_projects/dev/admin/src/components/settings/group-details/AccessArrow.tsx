import React, { ReactNode } from 'react';

export default function AccessArrow({ 
  className, 
  title,
  children 
} : { 
  className?:string, 
  title?:string,
  children:ReactNode }) {
  return (
    <div className={`px-6 py-6 flex justify-between items-center ${className}`}>
      <div>
      <h3 className="h3 text-primary">{title}</h3>
      {children}
      </div>
    </div>
  );
}
