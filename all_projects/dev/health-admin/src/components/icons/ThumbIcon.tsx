import React from 'react';

export default function ThumbIcon({
  className
}: {
  className?: string
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" className={className || ''}>
    <g filter="url(#filter0_d_1_658)">
    <circle cx="14" cy="10" r="10" fill="#3B7AF7"/>
    <circle cx="14" cy="10" r="8.5" stroke="white" strokeWidth="3"/>
    </g>
    <defs>
    <filter id="filter0_d_1_658" x="0" y="0" width="28" height="28" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="2"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1_658"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1_658" result="shape"/>
    </filter>
    </defs>
    </svg>
  );
}
