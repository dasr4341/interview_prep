import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { ErrorMessage } from '@hookform/error-message';
import { SurveyFormSchema, ValidationTypes } from 'interface/dynamic-field-data.interface';
import { useEffect, useState } from 'react';
import { FieldArrayWithId, FieldPath, useFormContext } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { config } from 'config';
import messagesData from 'lib/messages';

export default function ValidatorRow({
  validatorName,
  index,
  field,
}: {
  validatorName: ValidationTypes;
  index: number;
  field: FieldArrayWithId<SurveyFormSchema, 'fields', 'id'>;
}) {
  const [checked, setChecked] = useState(false);
  const [selectDate, setSelectDate] = useState<Date>();
  const {
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<SurveyFormSchema>();

  const fieldName: FieldPath<SurveyFormSchema> = `fields.${index}.validation.${validatorName}`;

  useEffect(() => {
    setValue(`${fieldName}.active`, Boolean(field.validation.required?.active));
    setValue(`${fieldName}.message`, field.validation.required?.message);
    setChecked(Boolean(field.validation.required?.active));
  }, [field, fieldName, setValue]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 items-center mb-2">
      <div className="flex items-center mt-2">
        <label className="mr-3 capitalize w-1/2">{validatorName.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2')}</label>
        <ToggleSwitch
          checked={checked}
          onChange={() => {
            if (!fieldName) return;
            setChecked(!checked);
            setValue(`${fieldName}.active`, !checked);
          }}
        />
      </div>
      {checked && (
        <>
          {validatorName === 'maxLength' && (
            <div className="flex flex-col ml-4">
              <input
                type="number"
                className="border border-gray-500 rounded-md"
                {...register(`fields.${index}.validation.${validatorName}.max`, { required: true, validate: (v) => !!Number.isInteger(v) })}
                placeholder="Enter maximum length"
                min={1}
                step={1}
              />
              <ErrorMessage
                errors={errors}
                name={`fields.${index}.validation.${validatorName}.max`}
                render={() => <p className="text-red-800 text-sm mt-1">{validatorName} field is required</p>}
              />
            </div>
          )}

          {validatorName === 'maximumCheckedOptions' && (
            <div className="flex flex-col ml-4">
              <input
                type="number"
                className="border border-gray-500 rounded-md"
                {...register(`fields.${index}.validation.${validatorName}.max`, { required: true, validate: (v) => !!Number.isInteger(v) })}
                placeholder="Enter maximum checked item"
                min={1}
                step={1}
              />
              <ErrorMessage
                errors={errors}
                name={`fields.${index}.validation.${validatorName}.max`}
                render={() => <p className="text-red-800 text-sm mt-1">{validatorName} field is required</p>}
              />
            </div>
          )}

          {validatorName === 'minLength' && (
            <div className="flex flex-col ml-4">
              <input
                type="number"
                className="border border-gray-500 rounded-md"
                {...register(`fields.${index}.validation.${validatorName}.min`, { required: true, validate: (v) => !!Number.isInteger(v) })}
                placeholder="Enter minimum length"
              />
              <ErrorMessage
                errors={errors}
                name={`fields.${index}.validation.${validatorName}.min`}
                render={() => <p className="text-red-800 text-sm mt-1">{validatorName} field is required</p>}
              />
            </div>
          )}

          {validatorName === 'minimumCheckedOptions' && (
            <div className="flex flex-col ml-4">
              <input
                type="number"
                className="border border-gray-500 rounded-md"
                {...register(`fields.${index}.validation.${validatorName}.min`, { required: true, validate: (v) => !!Number.isInteger(v) })}
                placeholder="Enter minimum checked item"
                min={1}
                step={1}
              />
              <ErrorMessage
                errors={errors}
                name={`fields.${index}.validation.${validatorName}.min`}
                render={() => <p className="text-red-800 text-sm mt-1">{validatorName} field is required</p>}
              />
            </div>
          )}

          {validatorName === 'minimumDateRange' && (
            <div className="flex flex-col ml-4">
              <DatePicker
              className='cursor-pointer'
                dateFormat={config.dateFormat}
                onChange={(date) => {
                  if (date) {
                    setSelectDate(date);
                    setValue(`fields.${index}.validation.${validatorName}.minDate`, date.toISOString());
                    trigger(`fields.${index}.validation.${validatorName}.minDate`);
                  }
                }}
                wrapperClassName="date-picker custom-rounded"
                selected={selectDate ? selectDate : null}
                placeholderText={config.dateFormat}
              />

              <ErrorMessage
                errors={errors}
                name={`fields.${index}.validation.${validatorName}.minDate`}
                render={() => <p className="text-red-800 text-sm mt-1">{validatorName} field is required</p>}
              />
            </div>
          )}

          {validatorName === 'maximumDateRange' && (
            <div className="flex flex-col ml-4">
              <DatePicker
              className='cursor-pointer'
                dateFormat={config.dateFormat}
                onChange={(date) => {
                  if (date) {
                    setSelectDate(date);
                    setValue(`fields.${index}.validation.${validatorName}.maxDate`, date.toISOString());
                    trigger(`fields.${index}.validation.${validatorName}.maxDate`);
                  }
                }}
                wrapperClassName="date-picker custom-rounded"
                selected={selectDate ? selectDate : null}
                placeholderText={config.dateFormat}
              />

              <ErrorMessage
                errors={errors}
                name={`fields.${index}.validation.${validatorName}.maxDate`}
                render={() => <p className="text-red-800 text-sm mt-1">{validatorName} field is required</p>}
              />
            </div>
          )}

          {validatorName === 'patternValidation' && (
            <div className="flex flex-col ml-4">
              <input
                type="text"
                className="border border-gray-500 rounded-md"
                {...register(`fields.${index}.validation.${validatorName}.pattern`, { required: true })}
                placeholder="Enter a regex pattern"
              />
              <ErrorMessage
                errors={errors}
                name={`fields.${index}.validation.${validatorName}.pattern`}
                render={() => <p className="text-red-800 text-sm mt-1">{validatorName} field is required</p>}
              />
            </div>
          )}

          {validatorName !== 'minimumDateRange' && validatorName !== 'maximumDateRange' && (
            <div className="flex flex-col ml-4">
              <input
                type="text"
                className="border border-gray-500 rounded-md"
                {...register(`${fieldName}.message`, {
                  required: messagesData.errorList.required,
                  maxLength: {
                    value: config.form.inputFieldMaxLength,
                    message: messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength),
                  },
                  validate: (v) => !!v?.trim().length || messagesData.errorList.required })}
                placeholder="Enter message"
                defaultValue="This question is required"
              />
              <ErrorMessage
                errors={errors}
                name={`${fieldName}.message`}
                render={({ message }) => <p className="text-red-800 text-sm mt-1">{message}</p>}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
