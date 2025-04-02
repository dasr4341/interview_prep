import React from 'react';

import {
  Score,
  ScoreColor,
  ScoreDirection,
} from '../assement-report-interface';
import UpArrowIcon from 'components/icons/UpArrowIcon';
import DownArrowIcon from 'components/icons/DownArrow';

export default function ScoreComponent({
  value,
  percent,
  info,
}: {
  value: string;
  percent: Score;
  info: string;
}) {
  return (
    <div>
      <div className="flex flex-row items-center gap-x-2 mt-2">
        <label className="font-bold text-xsmd">{value}</label>

        {(Boolean(percent.value) && percent.direction ) && (
          <>
            {percent.direction === ScoreDirection.up ? (
              <UpArrowIcon className={`${
                (percent.color === ScoreColor.green)
                  ? 'text-green'
                  : 'text-red-600'
              } font-medium w-3 h-3`} />
            ) : (
              <DownArrowIcon className={`${
                (percent.color === ScoreColor.green)
                  ? 'text-green'
                  : 'text-red-600'
              } font-medium w-3 h-3`} />
            )}
          </>
        )}

        {Boolean(percent.value) && (
          <span
            className={`${
              (percent.color === ScoreColor.green) ? 'text-green' : 'text-red-600'
            } font-medium text-xs ${!percent.direction ? 'pl-3' : ''}`}>
            {`${percent.value}%`}
          </span>
        )}
      </div>
      <div className="font-medium text-xss text-gray-600 pb-3">{info}</div>
    </div>
  );
}
