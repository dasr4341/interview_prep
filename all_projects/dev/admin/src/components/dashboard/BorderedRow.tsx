import classNames from 'classnames';
import React from 'react';
import './_borderrow.scoped.scss';

export default function BorderedRow({
  num,
  text,
  onClick,
  colorCode,
  selected,
}: {
  num: number;
  text: string;
  onClick?: () => void;
  colorCode: string;
  selected?: boolean;
}) {
  return (
    <div
      className={classNames(
        'flex flex-row items-center space-x-2 pb-4 border-b border-gray-350 w-full sm:w-4/5 pl-4 relative bordered-row',
        { 'opacity-50': selected === false },
      )}
      onClick={onClick}>
      <span className="color-box absolute left-0 inset-y-auto" style={{ backgroundColor: colorCode }}></span>
      <span data-test-id="company-insights-numbers"className="text-gray-150 font-extrabold text-md">{num}</span>
      <span className="text-gray-600 font-medium text-xs">{text}</span>
    </div>
  );
}
