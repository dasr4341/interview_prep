import { averageFunction } from '../../../Helper/chart-helper';

export function sleepAnnotation(sleepAverage: number | null): any {
  const defaultSleepAnnotationProps = {
    type: 'line',
    borderColor: '',
    borderDash: [6, 6],
    borderDashOffset: 0,
    borderWidth: 2,
    label: {
      backgroundColor: 'transparent',
      color: 'rgb(0, 0, 0)',
      font: {
        size: 15,
        family: "'Open Sans', sans-serif",
        weight: '400',
      },
      textAlign: 'left',
      display: true,
    },
    scaleID: 'y',
    value: (data: number) => averageFunction(data),
  };

  const annotation = {
    ...defaultSleepAnnotationProps,
    label: {
      ...defaultSleepAnnotationProps.label,
      content: `${sleepAverage || 'N/A'} Minutes`,
      position: 'start',
      xAdjust: -140,
      yAdjust: 0
    },
  };

  const annotation1 = {
    ...defaultSleepAnnotationProps,
    label: {
      ...defaultSleepAnnotationProps.label,
      content: 'Average for Days',
      position: 'start',
      xAdjust: -140,
      yAdjust: 20
    },
  };

  const annotation2 = {
    ...defaultSleepAnnotationProps,
    label: {
      ...defaultSleepAnnotationProps.label,
      content: 'Displayed',
      position: 'start',
      xAdjust: -140,
      yAdjust: 40
    },
  };

  return {
    annotation,
    annotation1,
    annotation2
  };
}
