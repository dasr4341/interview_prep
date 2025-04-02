import React from 'react';

export default function HeatmapScale({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className || ''}
      width="302"
      height="13"
      viewBox="0 0 302 13"
      fill="none">
      <line
        x1="3.7931"
        y1="6.07619"
        x2="36.2069"
        y2="6.07619"
        stroke="#EA3F2A"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
      <line
        x1="47.3224"
        y1="6.07619"
        x2="79.7362"
        y2="6.07619"
        stroke="#ED6513"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
      <line
        x1="90.8517"
        y1="6.07619"
        x2="123.265"
        y2="6.07619"
        stroke="#F3DD4A"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
      <line
        x1="134.381"
        y1="6.07619"
        x2="166.795"
        y2="6.07619"
        stroke="#60DB89"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
      <line
        x1="177.91"
        y1="6.07619"
        x2="210.324"
        y2="6.07619"
        stroke="#29BF5C"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
      <line
        x1="221.44"
        y1="6.07619"
        x2="253.853"
        y2="6.07619"
        stroke="#37B060"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
      <line
        x1="264.969"
        y1="6.07619"
        x2="297.383"
        y2="6.07619"
        stroke="#13923E"
        strokeWidth="7.58621"
        strokeLinecap="round"
      />
    </svg>
  );
}
