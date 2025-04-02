import React, { useEffect, useState } from 'react';
import { Select, SelectItem } from '@mantine/core';

import { getAppData } from 'lib/set-app-data';
import { useAppSelector } from 'lib/store/app-store';
import { routes } from 'routes';
import { useParams } from 'react-router-dom';
import './_selectedFacility.scoped.scss';

export default function SelectedFacilityList({
  onChange,
  labelStyle,
  dropdownStyle,
  onInt,
  dropdownHeight,
  defaultValue
}: {
  onChange: (e) => void;
  labelStyle?: string;
  dropdownStyle?: string;
  onInt?: (isRequired: boolean) => void;
  dropdownHeight?: number;
  defaultValue? : string;
}) {
  const { templateId } = useParams();
  const [selectedFacility, setSelectedFacility] = useState<string | undefined>(defaultValue);
  const [selectedFacilityList, setSelectedFacilityList] = useState<SelectItem[]>([]);
  const facilityList = useAppSelector((state) => state.auth.user?.pretaaHealthCurrentUser.userFacilities);

  useEffect(() => {
    const appData = getAppData();
    const list = facilityList?.filter((f) => appData.selectedFacilityId?.includes(f.id)) || [];
    setSelectedFacilityList(
      list.map((e) => {
        return {
          label: e.name,
          value: e.id,
        };
      }),
    );
    if (onInt) {
      onInt(list.length > 1);
    }
    
  }, [facilityList]);

  function updateFacility(v) {
    setSelectedFacility(v);
    onChange(v);
  }

  return (
    <div className={`selected-facility ${selectedFacilityList.length > 1 ? '' : 'hidden'}`}>
      {location.pathname !== routes.assessmentScheduleCreateCampaign.build(String(templateId)) && (
        <label className={`${labelStyle}`}>Selected Facility</label>
      )}

      <Select
        className={`${dropdownStyle} pt-0 mt-0 app-react-select`}
        placeholder="Select Facility"
        value={selectedFacility}
        data={selectedFacilityList}
        onChange={updateFacility}
        nothingFound="Nothing found..."
        searchable={true}
        clearable={true}
        styles={{
          input: {
            height: dropdownHeight ? dropdownHeight : '43px',
          },
          wrapper: {
            padding: '6px 0px',
          },
        }}
      />
    </div>
  );
}

