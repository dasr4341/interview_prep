import { useLazyQuery } from '@apollo/client';
import { getDayMonthRangeFilterList } from 'graphql/getDayMonthRangeFilterList.query';
import {
  GetDayMonthRangeFilterList,
  ReportingDateFilter,
} from 'health-generatedTypes';
import { SelectBox } from 'interface/SelectBox.interface';
import catchError from 'lib/catch-error';
import { useAppDispatch } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import { counsellorReportingSliceActions } from 'lib/store/slice/reporting-Filter/counsellorEventReporting/counsellorEventReporting.slice';
import { useEffect, useState } from 'react';



export default function useDayMonthRangeFilter(assignDefaultValueFor?: 'assessmentFilter' | 'reportFilter' | 'clinicianFilter' | null ) {
  const [options, setOptions] = useState<SelectBox[]>([]);
  const dispatch = useAppDispatch();

  function setDefaultValue(defaultValue: SelectBox,  defaultFilterFor: 'assessmentFilter' | 'reportFilter' | 'clinicianFilter') {
    dispatch(
      appSliceActions.setDefaultValuesForDateMonthRangeFilter({ data: defaultValue, defaultFilterFor })
    );
    dispatch(
      counsellorReportingSliceActions.setDefaultValuesForDateMonthRangeFilter({ data: defaultValue })
    );
  }

  const [getDayMonthRangeData, { loading }] =
    useLazyQuery<GetDayMonthRangeFilterList>(getDayMonthRangeFilterList, {
      onCompleted: (d) => {
        if (d.pretaaHealthGetDayMonthRangeFilterList) {
          const defaultValues: { label: string, value: ReportingDateFilter } = {
            label: d.pretaaHealthGetDayMonthRangeFilterList.find(option => option.value === ReportingDateFilter.SEVEN_DAYS)?.name || '',
            value: ReportingDateFilter.SEVEN_DAYS,
          };
          setOptions(() =>
            d.pretaaHealthGetDayMonthRangeFilterList.map((e) => ({
              value: String(e.value),
              label: String(e.name).replaceAll('_', ' '),
            }))
          );
          if (assignDefaultValueFor) {
            setDefaultValue(defaultValues, assignDefaultValueFor);
          }
        }
      },
      onError: (e) => catchError(e, true),
    });

  useEffect(() => {
    if (!!assignDefaultValueFor) {
      getDayMonthRangeData();
    }
  }, [assignDefaultValueFor]);

  return {
    loading,
    options,
  };
}
