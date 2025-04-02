import { ErrorMessage } from '@hookform/error-message';
import Button from 'components/ui/button/Button';
import { SurveyFormSchema } from 'interface/dynamic-field-data.interface';
import { useMemo } from 'react';
import { FieldArrayWithId, useFormContext } from 'react-hook-form';
import CustomValidation from './custom-validation';
import MultiSelectionInput from './multiselect-input';
import RangeInput from './range-input';
import TextInput from './text-input';
import { RxCross2 } from 'react-icons/rx';
import { config } from 'config';
import messagesData from 'lib/messages';
import { MultiSelectValidationErrorInterface } from '../TemplateFormControl';


interface RowProps {
  index: number;
  field: FieldArrayWithId<SurveyFormSchema, 'fields', 'id'>;
  remove: (index: number) => void;
  setValidationErrorStatus: React.Dispatch<React.SetStateAction<MultiSelectValidationErrorInterface | null>>
}

export default function InputRow({ index, field, remove, setValidationErrorStatus }: RowProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormSchema>();

  const InputMemo = useMemo(() => {
    switch (field.inputType) {
      case 'text':
      case 'textarea':
        return <TextInput index={index} classname="max-w-1/2" />;

      case 'date':
        return <TextInput index={index} classname="w-32" placeholder='mm/dd/yyyy' />;

      case 'range':
        return <RangeInput index={index} />;

      case 'radio':
      case 'checkbox':
      case 'dropdown':
        return <MultiSelectionInput setValidationErrorStatus={setValidationErrorStatus} index={index} type={field.inputType} />;

      default:
        return <></>;
    }
  // 
  }, [field.inputType, index]);

  return (
    <div className="bg-white rounded-md border p-4 mb-4 flex flex-col relative border-yellow-500" key={index + 'row'}>
      {field.inputType !== 'html' && (
        <label className="text-primary flex-1 block w-full mr-2 mb-2">
          <input
            type="text"
            placeholder="Label for field"
            {...register(`fields.${index}.label`, {
              required: {
                value: true,
                message: messagesData.errorList.required,
              },
              validate: (v) => !!v.trim().length,
              maxLength: {
                value: config.form.inputFieldMaxLength,
                message: messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength),
              },
            })}
            className="w-3/4 border-0 border-b"
          />

          <ErrorMessage
            errors={errors}
            name={`fields.${index}.label`}
            render={() => (
              <p className="text-red-800 text-sm mt-1">{errors.fields && errors?.fields[index]?.label?.message}</p>
            )}
          />
        </label>
      )}
      {field.inputType === 'html' && (
        <label className="text-primary flex-1 block w-full mr-2 mb-2">
          <textarea
            placeholder="Enter custom html"
            {...register(`fields.${index}.label`, { required: true, validate: (v) => !!v.trim().length })}
            className="w-3/4 border-0 border-b"
          />
          <ErrorMessage
            errors={errors}
            name={`fields.${index}.label`}
            render={() => <p className="text-red-800 text-sm">{messagesData.errorList.required}</p>}
          />
        </label>
      )}
      {InputMemo}
      <div className="absolute top-4 right-4">
        <Button type="button" buttonStyle="bg-none" size="xs" onClick={() => remove(index)}>
          <RxCross2 className="text-md text-gray-600" />
        </Button>
      </div>
      {field.inputType !== 'html' && <CustomValidation index={index} field={field} />}
    </div>
  );
}
