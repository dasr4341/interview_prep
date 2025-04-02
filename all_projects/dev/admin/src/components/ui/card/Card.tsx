import React, { ReactNode } from 'react';

export default function Card({ children, className, style }: 
  { children: ReactNode, className?:string, style?: React.CSSProperties }) {
  return (
    <div style={style} className={`w-full bg-white rounded-xl ${className}`} data-testid="card" >
      { children }
    </div>
  );
}
