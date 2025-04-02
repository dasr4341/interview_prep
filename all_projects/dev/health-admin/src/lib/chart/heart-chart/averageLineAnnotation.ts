import { averageFunction } from '../../../Helper/chart-helper';

export const averageLineAnnotation = (averageValue?: number | null): any => {
  const commonAnnotationProps = {
    type: 'line',
    borderColor: 'black',
    borderDash: [6, 6],
    borderDashOffset: 0,
    borderWidth: 2,
    label: {
      enabled: true,
      display: true,
      backgroundColor: 'transparent',
      color: 'rgba(0, 0, 0, 1)',
      font: {
        size: 16,
        family: "'Open Sans', sans-serif",
        weight: '400',
      },
      position: '100%',
    },
    scaleID: 'y',
    value: (data: number) => averageFunction(data),
  };

  const annotationHeartRate = {
    ...commonAnnotationProps,
    label: {
      ...commonAnnotationProps.label,
      // content: (data: number) => ' ' + averageFunction(data).toFixed(1) + ' BPM',
      content: `${averageValue || 'N/A'} BPM`,
      // xAdjust: 106,
      xAdjust: 80,
      yAdjust: -12,
    },
  };

  const annotationHeartRate2 = {
    ...commonAnnotationProps,
    label: {
      ...commonAnnotationProps.label,
      content: 'Average',
      xAdjust: 82,
      yAdjust: 12,
    },
  };

  return {
    annotationHeartRate,
    annotationHeartRate2
  };
};
