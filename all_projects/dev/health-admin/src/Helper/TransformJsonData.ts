import messagesData from 'lib/messages';
import { toast } from 'react-toastify';

export enum InputTypeEnum {
  TEXT = 'text',
  TEXTAREA = 'textarea',
  DATE = 'date',
  RADIO = 'radio',
  CHECKBOX = 'checkbox',
  DROPDOWN = 'dropdown',
  RANGE = 'range',
  HTML = 'html',
  NOUISLIDER = 'nouislider',
}

interface ElementsInterface {
  name: string;
  parentQuestionName?: string;
  type: string;
  title?: string;
  html?: string;
  rangeValue?: string;
  isRequired?: boolean;
  choices?: {
    value: string;
    text: string;
  }[];
  rangeMin?: number;
  rangeMax?: number;
  step?: number;
  startValue?: number;
  defaultValue?: number;
  conditionalValidation?: {
    parent: number;
    operator: string;
    value: number;
    skip: number;
  };
}

function getInputType(inputType: string): InputTypeEnum {
  if (inputType.includes(InputTypeEnum.RADIO)) {
    return InputTypeEnum.RADIO;
  }
  if (inputType.includes(InputTypeEnum.HTML)) {
    return InputTypeEnum.HTML;
  }
  if (inputType.includes(InputTypeEnum.NOUISLIDER)) {
    return InputTypeEnum.RANGE;
  }
  if (inputType.includes(InputTypeEnum.TEXT)) {
    return InputTypeEnum.TEXT;
  }
  if (inputType.includes(InputTypeEnum.DATE)) {
    return InputTypeEnum.DATE;
  }
  if (inputType.includes(InputTypeEnum.CHECKBOX)) {
    return InputTypeEnum.CHECKBOX;
  }
  if (inputType.includes(InputTypeEnum.DROPDOWN)) {
    return InputTypeEnum.DROPDOWN;
  }
  if (inputType.includes(InputTypeEnum.RANGE)) {
    return InputTypeEnum.RANGE;
  }
  return inputType as InputTypeEnum;
}

function getOptions(inputType: InputTypeEnum, choices: any[] | undefined | null) {
  if (
    (inputType === InputTypeEnum.DROPDOWN ||
      inputType === InputTypeEnum.CHECKBOX ||
      inputType === InputTypeEnum.RADIO) &&
    choices?.length
  ) {
    return choices.map((o) => {
      return {
        label: o.text,
        value: o.value,
      };
    });
  }
  return [];
}

function getRangeAndStep(
  inputType: InputTypeEnum,
  step: number | undefined,
  range: {
    rangeMin: number | undefined;
    rangeMax: number | undefined;
  }
) {
  if (inputType === InputTypeEnum.RANGE || inputType === InputTypeEnum.NOUISLIDER) {
    return {
      step: String(step),
      rangeValue: `${range.rangeMin || 0},${range.rangeMax || 0}`,
    };
  }
  return {
    step: null,
    rangeValue: null,
  };
}

export default function TransformJsonData(
  jsonData: {
    elements: ElementsInterface[];
  }[]
) {
  try {
    return jsonData
      .map((e) => e.elements.map((ele) => {
          const inputType = getInputType(ele.type.toLowerCase());

          const required = {
            active: ele.isRequired,
            message: messagesData.errorList.requiredQuestion,
            conditionalValidation: ele.conditionalValidation,
          };

          const { rangeValue, step } = getRangeAndStep(inputType, ele.step, {
            rangeMin: ele?.rangeMin,
            rangeMax: ele?.rangeMax,
          });

          return {
            id: null,
            questionName: ele?.name,
            parentQuestionName: ele?.parentQuestionName,
            inputType,
            label: ele?.title || ele?.html || ele?.name,
            placeholder: '',
            validation: ele?.isRequired
              ? {
                  required,
                }
              : null,
            rangeValue,
            step,
            options: getOptions(inputType, ele?.choices),
          };
        })
      )
      .flat();
  } catch (e: any) {
    // in case of in-valid json
    toast.error(e.message);
  }
}
