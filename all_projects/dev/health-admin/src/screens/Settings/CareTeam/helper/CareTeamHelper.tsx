import * as yup from 'yup';

import { CareTeamTypes, UserStaffTypes } from "health-generatedTypes";
import messages, { messagesData } from 'lib/messages';
import SpaceOnly from 'lib/form-validation/space-only';
import { config } from 'config';
import { yupEmailValidation } from 'lib/validation/yup-email-validation';
import { phoneNoValidation } from 'lib/validation/phone-no-validation';

export interface SelectBox {
  value: CareTeamTypes;
  label: string;
  description?: string;
}

export interface UseFormInterface {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: UserStaffTypes[];
  careTeamTypes?: CareTeamTypes[] | null;
  facilityIds?: string[] | null;
}

export interface SelectedFacilitiesInterface {
  value: string;
  label: string;
}

export const customStyleSelectBox = {
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
  }),
  singleValue: () =>
    ({
      maxWidth: '100%',
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'pre',
    } as any),
  option: (provided: any) => ({
    ...provided,
    cursor: 'pointer',
  }),
};

export const careTeamSchema = yup.object().shape({
  firstName: yup
    .string()
    .required(messages.errorList.required)
    .transform(SpaceOnly)
    .typeError(messages.errorList.required)
    .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength)),
  lastName: yup
    .string()
    .required(messages.errorList.required)
    .transform(SpaceOnly)
    .typeError(messages.errorList.required)
    .max(config.form.inputFieldMaxLength, messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength)),
  email: yupEmailValidation,
  phone: phoneNoValidation,
  careTeamTypes: yup.array(yup.mixed<CareTeamTypes>().oneOf(Object.values(CareTeamTypes))),
  userType: yup.array(yup.mixed<UserStaffTypes>().oneOf(Object.values(UserStaffTypes))).ensure().min(1, messages.errorList.required),
  facilityIds: yup.array().of(yup.string()),
});