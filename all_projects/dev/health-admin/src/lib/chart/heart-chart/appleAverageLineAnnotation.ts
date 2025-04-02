import { averageFunction } from '../../../Helper/chart-helper';

export function setAppleAverageAnnotation(data: number) {
  const defaultAnnotationProp = {
    type: 'line',
    borderColor: 'black',
    borderDash: [6, 6],
    borderDashOffset: 0,
    borderWidth: 2,
    yMin: `${data}`,
    yMax: `${data}`,
    label: {
      enabled: true,
      display: true,
      backgroundColor: 'transparent',
      color: 'rgba(0, 0, 0, 1)',
      font: {
        size: 16,
        family: "'Open Sans', sans-serif",
        weight: 400,
      },
      position: '100%',
    },
    value: (ctx: any) => averageFunction(ctx),
  };
  const annotationHeartRate = {
    ...defaultAnnotationProp,
    label: {
      ...defaultAnnotationProp.label,
      content: `${data} BPM`,
      xAdjust: 95,
      yAdjust: -12,
    },
  };
  const annotationHeartRate2 = {
    ...defaultAnnotationProp,
    label: {
      ...defaultAnnotationProp.label,
      content: 'Average',
      xAdjust: 100,
      yAdjust: 12,
    },
  };

  return {
    annotationHeartRate,
    annotationHeartRate2,
  };
}
