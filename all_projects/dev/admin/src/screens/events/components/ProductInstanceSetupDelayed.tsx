import { LabeledValue } from 'components/LabeledValue';
import dayjs from 'dayjs';
import React, { FC } from 'react';

interface Props {
  avgDaysInStageAcross: string;
  percentAboveNormal: string;
  daysSincePurchase: string;
  lastTouchpoint: string;
}

const ProductInstanceSetupDelayed: FC<Props> = ({
  avgDaysInStageAcross,
  percentAboveNormal,
  daysSincePurchase,
  lastTouchpoint,
}) => {
  return (
    <div
      className="bg-white grid md:grid-cols-2 lg:grid-cols-3 gap-y-6 px-5
py-6 border border-gray-200 rounded-xl">
      <LabeledValue label="Average Days in Stage">{avgDaysInStageAcross}</LabeledValue>
      <LabeledValue label="Percent Above Normal">{percentAboveNormal}</LabeledValue>
      <LabeledValue label="Days in Stage">{daysSincePurchase}</LabeledValue>
      <LabeledValue label="Last Touchpoint">
        { lastTouchpoint ? dayjs(lastTouchpoint).format('MMM DD YYYY') : 'NA'}
      </LabeledValue>
    </div>
  );
};

export default ProductInstanceSetupDelayed;
