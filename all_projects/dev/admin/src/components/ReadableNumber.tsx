import React from 'react';
import Humanize from 'humanize-plus';

export default function ReadableNumber({
  number,
  float,
}: {
  number: number | null | undefined;
  float?: boolean;
}) {
  if (!number) {
    number = 0;
  }
  return float ? (
    <>{Humanize.formatNumber(number, 2)}</>
  ) : (
    <>{Humanize.formatNumber(number)}</>
  );
}
