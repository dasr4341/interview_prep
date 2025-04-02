import { ErrorMessage } from '@hookform/error-message';
import { config } from 'config';
import { SurveyFormSchema } from 'interface/dynamic-field-data.interface';
import messagesData from 'lib/messages';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function TextInput({ index, classname, placeholder }: { index: number; classname?: string; placeholder?: string }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<SurveyFormSchema>();

  return (
    <>
      <input
        type="text"
        {...register(`fields.${index}.placeholder`, {
          validate: (v) => !(!!v.length && !v.replaceAll(' ', '').length), maxLength: {
            value: config.form.inputFieldMaxLength,
            message: messagesData.errorList.errorMaxLength(config.form.inputFieldMaxLength),
          } })}
        className={`text-primary focus:outline-none border-0
      border-b border-gray-300 ${classname}`}
        placeholder={placeholder ? placeholder : 'Placeholder text'}
      />

      <ErrorMessage
        errors={errors}
        name={`fields.${index}.placeholder`}
        render={() => <p className="text-red-800 text-sm">{errors.fields && errors?.fields[index]?.placeholder?.message}</p>}
      />
    </>
  );
}
