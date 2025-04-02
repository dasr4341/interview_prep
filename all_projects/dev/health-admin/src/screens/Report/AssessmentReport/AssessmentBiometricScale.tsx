import React from 'react';

import HeatmapScale from 'components/icons/HeatmapScale';
import HeatmapScaleEllipse from 'components/icons/HeatmapScaleEllipse';

export default function AssessmentBiometricScale({
  biometricScore
}: {
  biometricScore: number
}) {
  function getStyle(value: number) {
    switch (value) {
      case -3:
        return 'left-2 reportScale-6';
      case -2:
        return 'left-14 -ml-1.5 reportScale-5';
      case -1:
        return 'left-24 -ml-0.5 reportScale-4';
      case 0:
        return 'left-36 -ml-1.5 reportScale-0';
      case 1:
        return 'right-24 -ml-0.5 reportScale-1';
      case 2:
        return 'right-12 -ml-1.5 reportScale-2';
      case 3:
        return 'right-2 ml-3 reportScale-3';
      default:
        return 'ml-2 reportScale-6';
    }
  }
  return (
    <div className="flex flex-1 py-3">
      <div className="relative">
        <HeatmapScale />
        <HeatmapScaleEllipse
          className={`absolute top-0 -mt-1.5 ${getStyle(biometricScore)} `}
        />
      </div>
    </div>
  );
}
