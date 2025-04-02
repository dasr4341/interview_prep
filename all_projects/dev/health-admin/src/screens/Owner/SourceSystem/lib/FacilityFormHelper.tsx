import { components } from 'react-select';
import UpDownIcon from '../../../../assets/icons/up-down-icon.svg';

export interface FacilityRouteQuery {
  systemId: string;
  systemName: string;
  facilityName?: string;
  systemSlug?: string;
  facilityId?: string;
}

export interface CustomSourceSystemData {
  createdAt: string;
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

export interface FacilityUsersInterface {
  id: string;
  facilitiesName: string;
  status: boolean;
  createdAt: string | null;
  timeZone: string;
  sourceSystemId: string;
  sourceSystem: string;
  activePatients: number;
}

export interface FacilityKipuLocationArgs {
  locationId: string;
  locationName: string;
  timeZone: string;
  offset: string;
}

export interface DynamicField {
  id: string;
  value: string;
}
export interface KipuLocation {
  locationName: string;
  enabled: boolean;
  locationId: number;
}

export const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <img
        src={UpDownIcon}
        width={26}
        height={26}
        alt="up-down-icon"
      />
    </components.DropdownIndicator>
  );
};

export const timezoneCustomStylesSelectBox = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    borderRadius: '4px',
    borderColor: '#228BE6',
  }),
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#ADB5BD',
      boxShadow: ' 0 !important',
    };
  },
};

export const customTimeZoneStylesSelectBox = {
  control: (baseStyles: any) => ({
    ...baseStyles,
    padding: '3px 0',
    borderRadius: '4px',
    borderColor: '#D8D8D8',
  }),
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#B0B0C6',
      boxShadow: ' 0 !important',
    };
  },
};