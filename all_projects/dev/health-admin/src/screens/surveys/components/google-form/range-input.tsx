/*  */
import { FieldError, useFormContext } from 'react-hook-form';

import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { SurveyFormSchema } from 'interface/dynamic-field-data.interface';
import { config } from 'config';
import messagesData from 'lib/messages';

export default function RangeInput({ index, classname }: { index: number; classname?: string }) {
  const { register, getFieldState } = useFormContext<SurveyFormSchema>();

  function getError(field: 'rangeValue' | 'defaultValue' | 'step'): FieldError | null {
    const fieldErrorState = getFieldState(`fields.${index}`)?.error as unknown as any;

    if (fieldErrorState && fieldErrorState[field]) {
      return fieldErrorState[field] as FieldError;
    }
    return null;
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="grid grid-cols-1">
          <div className="flex flex-col">
            <label className="mb-2">Range Value</label>
            <input
              type="text"
              placeholder="100,200"
              {...register(`fields.${index}.rangeValue`, {
                required: true,
                pattern: /^(\d+,\d+)$/,
                validate: (value) => {
                  const r = /^(\d+,\d+)$/;
                  const range = value.split(',').map((i) => Number(i));
                  if (r.test(value)) {
                    if (range[0] >= range[1]) {
                      return 'Second value should be greater than first value';
                    }
                  }
                  return undefined;
                },
              })}
              className={`text-primary focus:outline-none rounded-md border-gray-300 ${classname}`}
            />
          </div>
          {getError('rangeValue')?.type === 'required' && <ErrorMessage message={messagesData.errorList.required} />}
          {getError('rangeValue')?.type === 'pattern' && <ErrorMessage message={messagesData.errorList.commaSeparated} />}
          {getError('rangeValue')?.type === 'validate' && <ErrorMessage message={getError('rangeValue')?.message || ''} />}
        </div>

        <div className="grid grid-cols-1">
          <div className="flex flex-col">
            <label className="mb-2">Steps</label>
            <input
              type="text"
              placeholder='1'
              {...register(`fields.${index}.step`, {
                pattern: config.patterns.numberOnly
              })}
              className={`text-primary focus:outline-none rounded-md border-gray-300 ${classname}`}
            />
          </div>{' '}
          {getError('step')?.type === 'pattern' && <ErrorMessage message={messagesData.errorList.numberAllowed} />}
        </div>
      </div>
    </div>
  );
}
