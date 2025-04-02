import { DynamicInputHtml, DynamicInputRange, DynamicInputText, DynamicMultipleSelection } from 'interface/dynamic-field-data.interface';
import { FieldError } from 'react-hook-form';

interface CustomFieldError {
  value: FieldError;
}

export interface CustomFieldErrors {
  [key: string]: CustomFieldError;
}

export function GetErrorMessage({
  item,
  errors,
}: {
  item: DynamicInputText | DynamicMultipleSelection | DynamicInputRange | DynamicInputHtml,
  errors: CustomFieldErrors,
}) {

  return (
    <>
      {
        (item.inputType === 'text' || item.inputType === 'textarea') && errors[item.id] && (
          <div className="text-red-800 text-sm margin-top-8 sentence-case mt-4 bg-red-50 px-2 py-1 rounded w-fit">
            {
              (errors[item.id]?.value?.type === 'validate' && item.validation.required?.active && <p>{item.validation.required?.message}</p>) ||
              (errors[item.id]?.value?.type === 'required' && item.validation.required?.active && <p>{item.validation.required?.message}</p>) ||
              (errors[item.id]?.value.type === 'minLength' && item.validation.minLength?.active && <p>{item.validation.minLength?.message}</p>) ||
              (errors[item.id]?.value.type === 'maxLength' && item.validation.maxLength?.active && <p>{item.validation.maxLength?.message}</p>) ||
              (errors[item.id]?.value.type === 'pattern' && item.validation.patternValidation?.active && <p>{item.validation.patternValidation?.message}</p>)}
          </div>
        )
      }

      {(item.inputType === 'radio' || item.inputType === 'dropdown' || item.inputType === 'date') && errors[item.id] && (

        <div className="text-red-800 text-sm margin-top-8 sentence-case mt-4 bg-red-50 px-2 py-1 rounded w-fit">
          {errors[item.id]?.value.type === 'required' && item.validation.required?.active && item.validation.required?.message}
        </div>

      )}

      {(item.inputType === 'checkbox') && errors[item.id] &&
        (
          <div className="text-red-800 text-sm margin-top-8 sentence-case mt-4 bg-red-50 px-2 py-1 rounded w-fit">
            {(errors[item.id]?.value.type === 'required' && item.validation.required?.active && <p>{item.validation.required?.message}</p>) ||
              (errors[item.id]?.value.type === 'minChecked' && item.validation.minimumCheckedOptions?.active && <p>{item.validation.minimumCheckedOptions?.message}</p>) ||
              (errors[item.id]?.value.type === 'maxChecked' && item.validation.maximumCheckedOptions?.active && <p>{item.validation.maximumCheckedOptions?.message}</p>)}
          </div>
        )
      }
      
      {(item.inputType === 'range') && errors[item.id] &&
        (
          <div className="text-red-800 text-sm margin-top-8 sentence-case mt-4 bg-red-50 px-2 py-1 rounded w-fit">
            {(errors[item.id]?.value.type === 'required' && item.validation.required?.active && <p>{item.validation.required?.message}</p>)}
          </div>
        )
      }
    </>
  );
}