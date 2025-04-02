import { SurveyFormSchema, ValidationTypes } from 'interface/dynamic-field-data.interface';
import { FieldArrayWithId } from 'react-hook-form';
import ValidatorRow from './validator-row';
import { useId } from 'react';

export default function CustomValidation({ index, field }: { index: number; field: FieldArrayWithId<SurveyFormSchema, 'fields', 'id'> }) {
  const validators: ValidationTypes[] = ['required'];
  const id = useId();

  
  /**
   * Info: This code Required 
   * If someone wants to add types 
   
  if (inputType === 'text' || inputType === 'textarea') {
    validators.push('minLength', 'maxLength', 'patternValidation');
  } else if (inputType === 'checkbox') {
    validators.push('minimumCheckedOptions', 'maximumCheckedOptions');
  } else if (inputType === 'date') {
    validators.push('minimumDateRange', 'maximumDateRange');
  }

   * 
   */
  

  return (
    <div className='mt-4'>
      <h2 className='font-bold'>Custom validation</h2>
      {validators.map((item) => (
        <ValidatorRow
          key={`${item}${id}`}
          validatorName={item}
          index={index}
          field={field} />)
      )
      }
    </div>
  );
}
