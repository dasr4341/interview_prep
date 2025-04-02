import { averageFunction } from '../../../Helper/chart-helper';

export function hrvAnnotation(hrvAverage: number | null): any {
  const defaultSpo2AnnotationProps = {
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
    ...defaultSpo2AnnotationProps,
    label: {
      ...defaultSpo2AnnotationProps.label,
      content: `${hrvAverage || 'N/A'}ms`,
      position: 'end',
      xAdjust: 70,
      yAdjust: 0,
    },
  };

  const annotation1 = {
    ...defaultSpo2AnnotationProps,
    label: {
      ...defaultSpo2AnnotationProps.label,
      content: 'Avg',
      position: 'end',
      xAdjust: 55,
      yAdjust: 18,
    },
  };

  const annotation2 = {
    ...defaultSpo2AnnotationProps,
    label: {
      ...defaultSpo2AnnotationProps.label,
      content: 'HRV',
      position: 'start',
      xAdjust: -70,
      yAdjust: 0
    },
  };

  return {
    annotation,
    annotation1,
    annotation2,
  };
}