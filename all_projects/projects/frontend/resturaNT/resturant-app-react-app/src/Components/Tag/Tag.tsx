import React from 'react';

function Tag({
  bg,
  bold,
  children,
  textColor,
  textSize,
  padding,
  margin
}: {
    bg?: boolean,
  bold?: string,
    children?: JSX.Element,
    textColor?: string,
    textSize?: string
    padding?: string
    margin?: string
}) {
  return (
    <span className={`
    ${bg ? 'bg-theme-tag-bg ' : ''}
    ${bold === 'light' && 'font-bold ' }
    ${bold === 'dark' && 'font-extrabold ' }
    ${textColor === '400' && 'text-theme-tag-400' }
    ${textColor === 'slate-3' && 'text-slate-300' }
    ${textColor === 'slate-4' && 'text-slate-400' }
    ${textSize === 'xs' && 'text-xs'}
    ${textSize === 'sm' && 'text-xs md:text-sm '}
    ${textSize === 'lg' && 'text-sm md:text-lg '}
    ${textSize === 'xl' && 'text-base md:text-xl'}
    ${textSize === '2xl' && 'text-2xl'}
    ${!padding ? 'py-1 px-2' : padding}
    ${!margin ? 'mr-2' : margin}
     rounded-md text-justify  tracking-wider capitalize` }> {children} </span>
  );
}

export default Tag;