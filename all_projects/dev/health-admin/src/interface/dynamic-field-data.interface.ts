
export type FieldTypes = 'text' | 'textarea' | 'date' | 'radio' | 'checkbox' | 'dropdown' | 'range' | 'html';
export type ValidationTypes = keyof DynamicFieldData['validation'];

export interface SelectionOptions {
  id: number;
  label: string;
  value?: string;
}

export interface DynamicInputText extends DynamicFieldData {
  inputType: 'text' | 'textarea' | 'date';
}

export interface DynamicMultipleSelection extends DynamicFieldData {
  inputType: 'radio' | 'checkbox' | 'dropdown';
  options: SelectionOptions[];
}

export interface DynamicInputRange extends DynamicFieldData {
  inputType: 'range';
  rangeValue: string;
  step: string;
}
export interface DynamicInputHtml extends DynamicFieldData {
  inputType: 'html';
}

export interface DynamicValidationInactive {
  active: false;
  message?: string;
}

export interface DynamicValidationActive {
  active: true;
  message: string;
}

export interface DynamicValidationMin extends DynamicValidationActive {
  min: number;
}

export interface DynamicValidationMax extends DynamicValidationActive {
  max: number;
}

export interface DynamicValidationPattern extends DynamicValidationActive {
  pattern: string;
}

export interface DynamicValidationMinDate extends DynamicValidationActive {
  minDate: string;
}

export interface DynamicValidationMaxDate extends DynamicValidationActive {
  maxDate: string;
}

export interface DynamicFieldData {
  parentQuestionName?: string | null;
  questionName?: string | null;
  id: string;
  label: string;
  placeholder: string;
  validation: Partial<{
    required: DynamicValidationActive | DynamicValidationInactive;
    minLength: DynamicValidationMin | DynamicValidationInactive;
    maxLength: DynamicValidationMax | DynamicValidationInactive;
    minimumCheckedOptions?: DynamicValidationMin | DynamicValidationInactive;
    maximumCheckedOptions?: DynamicValidationMax | DynamicValidationInactive;
    patternValidation: DynamicValidationPattern | DynamicValidationInactive;
    minimumDateRange?: DynamicValidationMinDate | DynamicValidationInactive;
    maximumDateRange?: DynamicValidationMaxDate | DynamicValidationInactive;
    conditionalValidation: any;
    // conditionalValidation?: {
    //   parent: number;
    //   operator: string;
    //   value: number;
    //   skip: number;
    // };
      
  }>;
  value?: string | number | Array<string>;
}

export type SurveyField = DynamicInputText | DynamicMultipleSelection | DynamicInputRange | DynamicInputHtml;

export interface SurveyFormSchema {
  id: string;
  surveyName: string;
  isSignatureRequired?: boolean;
  description?: string;
  fields: Array<SurveyField>;
  facilityId?: string;
}

