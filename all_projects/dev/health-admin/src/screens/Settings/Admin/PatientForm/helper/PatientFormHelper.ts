import * as yup from 'yup';

import { UserInvitationOptions } from 'health-generatedTypes';
import messages from 'lib/messages';
import SpaceOnly from 'lib/form-validation/space-only';
import { phoneNoValidation } from 'lib/validation/phone-no-validation';
import { useAppSelector } from 'lib/store/app-store';

export interface SelectBoxForCareTeamList {
  value: string;
  label: string;
  careTeamDetailsToCareTeamTypes?: string[];
  description?: string;
}

export interface SelectBox {
  value: string;
  label: string;
  description?: string;
}

export const patientDetailsSchema = {
  contactType: yup
    .string()
    .required(messages.errorList.required)
    .transform(SpaceOnly)
    .typeError(messages.errorList.required),
  relationship: yup
    .string()
    .required(messages.errorList.required)
    .transform(SpaceOnly)
    .typeError(messages.errorList.required),
  name: yup.string().required(messages.errorList.required).transform(SpaceOnly).typeError(messages.errorList.required),
  email: yup.string().email(),
  phone: phoneNoValidation,
};

export const fieldsSchema = yup.object().shape({
  contactFrom: yup.array().of(yup.object().shape(patientDetailsSchema)),
});

export const customStyleSelectBoxCareTeam = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#363646',
      background: '#ffffff',
    };
  },
  control: (provided: any) => ({
    ...provided,
    borderRadius: '6px',
    borderColor: '#C5C5D8',
    flexWrap: 'nowrap',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#23265B',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '7px 12px',
  }),
  option: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
  }),
};

export const customStyleSelectBoxEhr = {
  placeholder: (defaultStyles: any) => {
    return {
      ...defaultStyles,
      color: '#B0B0C6',
    };
  },
  control: (provided: any) => ({
    ...provided,
    borderRadius: '5px',
    borderColor: '#D8D8D8',
    minHeight: 48,
    flexWrap: 'nowrap',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#23265B',
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: '8px 12px',
    textTransform: 'capitalize',
  }),
  option: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
  }),
};

export interface PatientFormFields {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string | null;
  genderIdentity: string | null;
  intakeDate: string;
  dischargeDate: string;
  dob: string;
  userInvitationStatus?: UserInvitationOptions;
  id?: string;
  facilityId?: string;
}

export interface FormDataInterface {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  gender: string | null;
  genderIdentity: string | null;
  intakeDate: string | null;
  dischargeDate: string | null;
  dob: string | null;
  selectFacility?: string;
}

export const genderOption: SelectBox[] = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
];

export type FormValues = {
  careTeamStaff: string; 
  careTeamRole: string;
};

export interface CareTeamsData {
  careTeamType: string | null;
  careTeamId?: string;
  careTeamStaffLabel?: string;
  firstName?: string;
  lastName?: string | null;
  isPrimary?: boolean;
  careTeamEnum?: string | string[];
}

export default function TypeTransform(careTeams: CareTeamsData[] | null | undefined) {
  const careTeamTypesLabel = useAppSelector((state) => state.app.careTeamTypesLabel).formattedData;
  const careTeamList = careTeams?.map(c => {

    const role = c.careTeamType?.split(', ');
    const formattedRoles = role?.map(r => (careTeamTypesLabel[r]?.updatedValue || careTeamTypesLabel[r]?.defaultValue) || c.careTeamType).join(', ')

    return {
      ...c,
      careTeamType: formattedRoles,
      careTeamEnum: c.careTeamType
    }
  });

  return careTeamList;
}
