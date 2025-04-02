import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import './_selectClinicianFilter.scoped.scss';
import { useAppDispatch, useAppSelector } from 'lib/store/app-store';
import { appSliceActions } from 'lib/store/slice/app/app.slice';
import {
  GetCareTeamTypesList,
} from 'health-generatedTypes';
import { getCareTeamTypesListQuery } from 'graphql/getCareTeamTypesList.query';
import catchError from 'lib/catch-error';
import { DropdownIndicator } from 'components/ui/SelectBox';
import Select from 'react-select';
import { SelectBox } from 'interface/SelectBox.interface';

export interface ClinicianTypeList {
  value: string;
  name: string;
}

export enum SelectedClinicianType {
  ALL = 'all',
}

const customStyleSelectBox = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#B0B0C6',
    };
  },
  control: (provided: any) => ({
    ...provided,
    borderRadius: '5px',
    borderColor: '#C5C5D8',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#23265B',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '6px 12px',
    cursor: 'pointer',
  }),
  singleValue: (provided: any) =>
    ({
      ...provided,
      maxWidth: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    whiteSpace: 'pre',
    textTransform: 'capitalize'
    } as any),
  option: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
  }),
};

export default function SelectClinicianTypeFilter({
  className,
}: {
  className?: string;
}) {
  const dispatch = useAppDispatch();
  const careTeamLabels = useAppSelector(state => state.app.careTeamTypesLabel).formattedData;

  const [ClinicianTypeList, setClinicianTypeList] = useState<SelectBox[]>([]);

  const clinicianReportFilter = useAppSelector(
    (state) => state.app.clinicianFilter
  );

  const { loading } = useQuery<
    GetCareTeamTypesList
  >(getCareTeamTypesListQuery, {
    onCompleted: (d) =>
      d.pretaaHealthGetCareTeamTypesList &&
      setClinicianTypeList(() => {
        return d.pretaaHealthGetCareTeamTypesList.map((e) => ({
          value: String(e.value),
          label: careTeamLabels[e.value].updatedValue || careTeamLabels[e.value].defaultValue,
        }));
      }),
    onError: (e) => catchError(e, true),
  });

  return (
     <div className={ className} style={{ zIndex: 2000 }}>
      <Select
        isLoading={loading}
        isSearchable={false}
        placeholder="Select Care Team Type"
        styles={customStyleSelectBox}
        hideSelectedOptions={false}
        value={ clinicianReportFilter.filterClinicianType ? {
          label: careTeamLabels[clinicianReportFilter.filterClinicianType.value].updatedValue || careTeamLabels[clinicianReportFilter.filterClinicianType.value].defaultValue ,
          value:  clinicianReportFilter.filterClinicianType.value
        } : null}
        className={'app-react-select w-full'}
        components={{
          IndicatorSeparator: () => null,
          DropdownIndicator,
        }}
        options={ClinicianTypeList}
        onChange={(data) => {
          dispatch(appSliceActions.setClinicianFilter({
            ...clinicianReportFilter,
            clinicianListAll: true,
            filterClinicianList: [],
            filterClinicianType: data as SelectBox
          }));
        }}
      />
     </div>
  );
}
