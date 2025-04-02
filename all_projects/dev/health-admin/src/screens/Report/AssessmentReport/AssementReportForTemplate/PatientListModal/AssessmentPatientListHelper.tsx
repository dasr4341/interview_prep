import { CompletedStatsHeader, ScoreData } from '../assement-report-interface';

export const convertColumnValue = (columnObj: { value?: number }): ScoreData => {
  return {
    ...columnObj,
    value: Number(columnObj?.value),
  } as ScoreData;
};

export const configureColumn = (col: string, colD: any, property: string) => {
  if (col === CompletedStatsHeader[property]) {
    colD.valueGetter = (params) => {
      return params?.data?.[property]?.value;
    };
  }
};
