import React from 'react';

export default function Card({
  number,
  text,
}: {
  number: number;
  text: string;
}) {
  return (
    <div className="
    flex flex-col
    w-48	rounded-lg	bg-pt-secondary py-3 px-4">
     
    <span className="font-extrabold	text-white text-md">{number}</span>
    <span className="text-white text-xs font-medium">{text}</span>
     
    </div>
  );
}
