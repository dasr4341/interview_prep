import { DynamicInputText } from 'interface/dynamic-field-data.interface';
import { cloneDeep } from 'lodash';
import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

export default function TextareaInput({
  register,
  updateTextareaRow,
  fieldSchema
}: {
  register: UseFormRegisterReturn;
  updateTextareaRow: (f: DynamicInputText) => void,
  fieldSchema: DynamicInputText
}) {
  function onUpdateTextareaInput(v: string) {
    const f = cloneDeep(fieldSchema);
    f.placeholder = v;
    updateTextareaRow(f);
  }

  return (
    <textarea
      {...register}
      className="text-gray-600 h-auto focus:outline-none 
          border-b-2 border-white focus:border-gray-300 resize-none"
      placeholder='Description'
      onBlur={e => onUpdateTextareaInput(e.target.value)}
       />
  );
}
