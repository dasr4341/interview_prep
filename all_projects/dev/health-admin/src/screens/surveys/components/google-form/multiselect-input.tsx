/*  */
import Button from 'components/ui/button/Button';
import CircleCloseIcon from 'components/icons/CircleCloseIcon';
import { FieldTypes, SurveyFormSchema } from 'interface/dynamic-field-data.interface';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import AddNewOption from './add-new-option';
import messagesData from 'lib/messages';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import React, { useCallback, useEffect } from 'react';
import { MultiSelectValidationErrorInterface } from '../TemplateFormControl';
import { multiselectValidation } from 'lib/helperFunction/multiselectValidation';

export interface MultiSelectOptionsInterface {
  id: null | string;
  label: string;
  value: string;
}

function MultiSelectionInput({
  index,
  type,
  setValidationErrorStatus,

}: {
  index: number;
  type: FieldTypes;
  setValidationErrorStatus: React.Dispatch<React.SetStateAction<MultiSelectValidationErrorInterface | null>>;
}) {
  const {
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext<SurveyFormSchema>();

  const { fields, remove, append } = useFieldArray({
    name: `fields.${index}.options`,
    rules: {
      minLength: 2,
      required: true,
    },
  });

  const { formState : { isSubmitting } } = useFormContext();

  const watchArrayValues = useWatch({
    name: `fields.${index}.options`,
  });

  const validate = useCallback(
    (arrayValues: MultiSelectOptionsInterface[]) => {
 
      let error = false;

      error = multiselectValidation(arrayValues, index, setError );

      if (error) {    
        setValidationErrorStatus((prevData: any) => {
          return {
            message: messagesData.errorList.resolveErrorsToContinue,
            errorFields: prevData?.errorFields?.includes(index) ? prevData.errorFields : [...(prevData?.errorFields || []), index]
          };
        });

      } else {
        setValidationErrorStatus((prevData: any) => {
          let errorFields = [];
          if (prevData && prevData.errorFields.includes(index)) {
            errorFields = prevData.errorFields.filter((errorId: number) => errorId !== index);
          }
          return { message: !!errorFields.length ?  messagesData.errorList.resolveErrorsToContinue : null, errorFields };
        });
      }
      return error;
    },
    [clearErrors, setValidationErrorStatus, index, setError]
  );



  useEffect(() => {
    if (isSubmitting) {   
      validate(watchArrayValues);
  }
  }, [watchArrayValues, validate, isSubmitting] );

  return (
    <>
      <section className=" flex flex-col space-y-3 mt-4">
        {fields.map((opt, i: number) => (
          <div key={opt.id} className="flex items-center md:justify-start justify-between   ">
            <div className="mr-2 mb-2 break-keep min-w-8">
              {i + 1}
              {'. '}
            </div>
            <div className=" flex md:flex-row  mb-2 flex-col md:space-x-2 md:space-y-0 space-y-2 items-start">
              <div className=" flex flex-col">
                <input
                  type="text"
                  {...register(`fields.${index}.options.${i}.label`, {
                    required: messagesData.errorList.required,
                  })}
                  placeholder={`${type[0].toUpperCase() + type.slice(1)} label`}
                  className="border-0 border-b text-primary border-gray-500"
                  onBeforeInput={() =>
                    setValidationErrorStatus((prevData: any) => {
                    let errorFields = [];
                    if (prevData && prevData.errorFields.includes(index)) {
                      errorFields = prevData.errorFields.filter((errorId: number) => errorId !== index);
                    }
                    return { message: null, errorFields };
                  })}
                />
                {!!errors.fields?.length &&
                  errors.fields[index] &&
                  !!(errors.fields[index] as any)?.options?.length &&
                  (errors.fields[index] as any)?.options[i]?.label && (
                    <ErrorMessage message={(errors.fields[index] as any)?.options[i]?.label?.message || messagesData.errorList.required} />
                  )}
              </div>

              <div className=" flex flex-col">
                <input
                  type="text"
                  {...register(`fields.${index}.options.${i}.value`, {
                    required: messagesData.errorList.required,
                  })}
                  className="border-0 border-b border-gray-500 text-primary"
                  placeholder={`${type[0].toUpperCase() + type.slice(1)} value`}
                  onBeforeInput={() =>
                    setValidationErrorStatus((prevData: any) => {
                    let errorFields = [];
                    if (prevData && prevData.errorFields.includes(index)) {
                      errorFields = prevData.errorFields.filter((errorId: number) => errorId !== index);
                    }
                    return { message: null, errorFields };
                  })}
                />
                {!!errors.fields?.length &&
                  errors.fields[index] &&
                  !!(errors.fields[index] as any)?.options?.length &&
                  (errors.fields[index] as any)?.options[i]?.value && (
                    <ErrorMessage message={(errors.fields[index] as any)?.options[i]?.value?.message || messagesData.errorList.required} />
                  )}
              </div>
              <Button type="button" classes="ml-2 hidden md:block" buttonStyle="bg-none" size="xs" onClick={() => remove(i)}>
                <CircleCloseIcon className="text-yellow-800" />
              </Button>
            </div>
            <Button type="button" classes="ml-2  block md:hidden" buttonStyle="bg-none" size="xs" onClick={() => remove(i)}>
              <CircleCloseIcon className="text-yellow-800" />
            </Button>
          </div>
        ))}
      </section>

      <AddNewOption
        onAdd={() => {
          const newId = Date.now();
          append({
            id: newId,
            label: '',
            value: '',
          });
        }}
      />
      {errors?.fields && errors.fields[index] && fields.length < 2 && <ErrorMessage message={messagesData.errorList.minOptionsRequired} />}
    </>
  );
}

export default React.memo(MultiSelectionInput, (prevProps, nextProps) => prevProps !== nextProps);
