import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import React, { ReactNode, useEffect, useState } from 'react';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import Button from 'components/ui/button/Button';
import helpIcon from 'assets/images/shape.svg';
import usePermission from 'lib/use-permission';
import { useMutation, useQuery } from '@apollo/client';
import { getThresholdsQuery } from 'lib/query/threshold/get-thresholds';
import validator from 'validator';

import { GetThresholds, PretaaUseCaseVariablesInputInnerArgs, SetThresholds, SetThresholdsVariables, UserPermissionNames } from 'generatedTypes';
import _ from 'lodash';
import Select from 'react-select';
import { useForm, Controller } from 'react-hook-form';
import Popup from 'reactjs-popup';
import { setThresholdMutation } from 'lib/mutation/threshold/set-threshold';
import { toast } from 'react-toastify';
import catchError from 'lib/catch-error';
import './ThresholdScreen.scss';
import { useNavigate } from 'react-router-dom';
import { successList } from '../../../../lib/message.json';
import { cursorStyleSelectInput } from '../../../../components/ui/SelectBox';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

interface Option {
  label: string | null;
  value: string | null;
}

export function Loading() {
  return (
    <>
      {_.range(0, 5).map((i) => (
        <div className="ph-item" key={i}>
          <div className="ph-col-12">
            <div className="ph-row">
              <div className="ph-col-6"></div>
              <div className="ph-col-4 empty"></div>
              <div className="ph-col-2"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

const RenderRow = ({ type, register, errors, control, salesStagesOptions }: { type: any; register: any; errors: any; control: any; salesStagesOptions: Option[] | undefined }) => {
  const [isFieldHidden, setIsFieldHidden] = useState(false);

  useEffect(() => {
    setIsFieldHidden(type.useCasePretaa.variables.some((v: any) => v.variableType === 'radio' && v.value === 'true'));
  }, [type.useCasePretaa.variables]);

  return type.useCasePretaa.variables.map((variable: any) => (
    <div key={variable.id} className="mb-2 flex items-center space-x-4 relative justify-end">
      <label htmlFor="variable" className={`text-base text-gray-150 px-2 label  ${isFieldHidden && variable.placeholder !== 'Default value' && 'hidden'}`}>
        {variable.placeholder}
      </label>
      {variable.variableType === 'radio' && (
        <>
          <Controller
            control={control}
            defaultValue={variable.value || variable.defaultValue}
            {...register(`${type.id}__${variable.id}`)}
            render={({ field: { onChange, value } }) => (
              <ToggleSwitch
                checked={value === 'false' ? false : true}
                dataAttr={`${type.id}__${variable.id}`}
                onChange={(val) => {
                  setIsFieldHidden(val);
                  onChange(val === false ? 'false' : 'true');
                }}
                color="blue"
              />
            )}
          />
          {errors[`${type.id}__${variable.id}`]?.type === 'custom' && <ErrorMessage message="Invalid message" />}
        </>
      )}
      {variable.variableType === 'text' && !isFieldHidden && (
        <>
          <div className='grow w-full'>
            <input
              defaultValue={variable.value || variable.defaultValue}
              type={variable.variableType}
              data-rule={`${variable.validateAs}`}
              {...register(`${type.id}__${variable.id}`)}
              placeholder={variable.placeholder}
              className="text-gray-600 placeholder:text-gray-600 overflow-hidden
                border border-gray-300 py-3 rounded-lg bg-none flex-1 input-field pr-10 w-full"
            />
            {errors[`${type.id}__${variable.id}`]?.type === 'custom' && <ErrorMessage message={errors[`${type.id}__${variable.id}`]?.message} />}

            {variable.variableDescription && (
              <Popup trigger={<img src={helpIcon} alt="help icon" className="absolute top-4 right-4" />} position={'bottom right'} on={['hover', 'focus']} arrow={true}>
                <div className="font-semibold p-2 text-pt-primary">{variable.variableDescription}</div>
              </Popup>
            )}
          </div>
        </>
      )}
      {variable.variableType === 'dropdown' && !isFieldHidden && (
        <Controller
          control={control}
          defaultValue={{
            label: variable.value || variable.defaultValue,
            value: variable.value || variable.defaultValue,
          }}
          name={`${type.id}__${variable.id}`}
          render={({ field: { onChange, value, ref } }) => {
            const isThirdVariable = type.displayName.includes('Stuck Sales Opportunities - Stage') && variable.variableName === 'VARIABLE 3';

            let selectedVal;
            if (isThirdVariable) {
              selectedVal = salesStagesOptions?.find((o) => {
                return o.value === value.value;
              })?.value;
            } else {
              selectedVal = variable.dropdownOptions.find((o: string) => o === value.value);
            }

            return (
              <>
                <Select
                  styles={cursorStyleSelectInput}
                  inputRef={ref}
                  components={{
                    IndicatorSeparator: null,
                  }}
                  classNamePrefix="react-select"
                  className="text-gray-600 placeholder:text-gray-600 
                       basic-single rounded-lg bg-none flex-1 mw-130"
                  options={
                    isThirdVariable
                      ? salesStagesOptions
                      : variable.dropdownOptions.map((option: string) => ({
                          value: option,
                          label: option,
                        }))
                  }
                  value={{ value: selectedVal, label: selectedVal }}
                  onChange={(val) => onChange(val)}
                  placeholder={variable.placeholder}
                />
                {variable.variableDescription && (
                  <Popup trigger={<img src={helpIcon} alt="help icon" className="absolute right-8" />} position={'bottom right'} on={['hover', 'focus']} arrow={true}>
                    <span className="font-semibold inline-block p-2 text-pt-primary">{variable.variableDescription}</span>
                  </Popup>
                )}
                {errors[`${type.id}__${variable.id}`]?.type === 'custom' && <ErrorMessage message="Invalid message" />}
              </>
            );
          }}
        />
      )}
    </div>
  ));
};

export default function ThresholdScreen() {
  const thresholdPermission = usePermission(UserPermissionNames.THRESHOLDS);
  const ThresholdAccordion = ({ children }: { children: ReactNode }) => {
    const [isActive, setIsActive] = useState(false);
    return (
      <div className="w-full flex flex-col">
        <div className="order-2" onClick={() => setIsActive(!isActive)}>
          <p className="text-primary-light underline text-xs cursor-pointer">{isActive ? 'Hide example' : 'Show example'}</p>
        </div>
        {isActive && <div className="accordion-content">{children}</div>}
      </div>
    );
  };
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const navigate = useNavigate();

  const [useCaseTypes, setUseCaseTypes] = useState<{ [name: string]: any }>();
  const [useCaseFlatTypes, setUseCaseFlatTypes] = useState<any>();
  const [salesStagesOptions, setSalesStagesOptions] = useState<Option[]>();
  const { data, loading } = useQuery<GetThresholds>(getThresholdsQuery);
  const [setThreshold, { loading: setThresholdLoading }] = useMutation<SetThresholds, SetThresholdsVariables>(setThresholdMutation);

  const onSubmit = async (values: any) => {
    const useCases: PretaaUseCaseVariablesInputInnerArgs[] = [];

    // Creating data for sending to API
    Object.keys(values).forEach((element) => {
      const value = values[element];
      let selectedUseCases = value.value;

      if (typeof value === 'boolean') {
        selectedUseCases =  value.toString();
      } else if (typeof value === 'string') {
        selectedUseCases =  value;
      }

      useCases.push({
        useCasesVariablesId: Number(element.split('__')[1]),
        useCaseId: element.split('__')[0],
        value: selectedUseCases,
      });
    });

    let hasError = false;

    // Validation Rule
    useCaseFlatTypes.forEach((el: any) => {
      const radioEl = el.useCasePretaa.variables.find((r: any) => r.variableType === 'radio');
      let radioId: string | null = null;

      if (radioEl) {
        radioId = `${el.id}__${radioEl.id}`;
      }

      el?.useCasePretaa.variables.forEach((e: any) => {
        // If row has radio and radio button enabled then validation not required
        if (radioId && values[radioId] === 'true') {
          return;
        }

        // Variables
        const currentValue = values[`${el.id}__${e.id}`];

        if (e.validateAs === 'positive_fractional_number') {
          if (!(validator.isNumeric(currentValue) && +currentValue > 0)) {
            hasError = true;
            setError(
              `${el.id}__${e.id}`,
              {
                type: 'custom',
                message: 'Number should be positive and any floating value',
              },
              { shouldFocus: true }
            );
          }
        } else if (e.validateAs === 'positive_whole_number') {
          if (!(validator.isInt(currentValue) && +currentValue > 0)) {
            hasError = true;
            setError(
              `${el.id}__${e.id}`,
              {
                type: 'custom',
                message: 'Number should be positive and any integer value',
              },
              { shouldFocus: true }
            );
          }
        } else if (e.validateAs === 'percentage') {
          if (!validator.isInt(currentValue, { min: 0, max: 100 })) {
            hasError = true;
            setError(`${el.id}__${e.id}`, { type: 'custom', message: 'Percentage should be between 0 - 100' }, { shouldFocus: true });
          }
        }
      });
    });

    if (!hasError) {
      try {
        await setThreshold({ variables: { pretaaSetThresholdsValues2: useCases } });
        toast.success(successList.thresholdUpdate);
      } catch (e) {
        catchError(e, true);
      }
    }
  };

  useEffect(() => {
    if (data?.pretaaGetThresholds) {
      let groupedTypes = _.groupBy(data?.pretaaGetThresholds, 'useCasePretaa.type');
      setUseCaseFlatTypes(data?.pretaaGetThresholds);

      if (groupedTypes?.PROSPECT_HEALTH) {
        const sortedProspectNews = _.sortBy(groupedTypes.PROSPECT_HEALTH, [
          function (o: any) {
            const name = o.name.split('_');
            return Number(name[name.length - 1]);
          },
        ]);
        groupedTypes = {
          ...groupedTypes,
          PROSPECT_HEALTH: sortedProspectNews,
        };
      }

      setUseCaseTypes(groupedTypes);
    }
    if (data?.pretaaGetSalesStages) {
      setSalesStagesOptions(data.pretaaGetSalesStages.map((stage) => ({ value: stage.name, label: stage.displayName })));
    }
  }, [data]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.thresholdScreen.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Thresholds" disableGoBack={true} breadcrumb={false} />
      <ContentFrame type="with-footer">
        {loading && <Loading />}
        <form>
          {useCaseTypes &&
            Object.keys(useCaseTypes).map((useCase, index) => (
              <div className="mb-8" key={index}>
                <h3 className="font-bold text-md text-primary mb-4">{_.startCase(useCase)}</h3>
                {_.sortBy(useCaseTypes[useCase], (obj) => parseInt(obj.displayName.split('Stuck Sales Opportunities - Stage ')[1]), ['asc']).map((type: any) => (
                  <div key={type.id} data-test-id="threshold-wrap" className="bg-white grid grid-cols-1 space-y-2 border-not-last-child px-4 py-6">
                    <div className="block md:flex space-x-0 md:space-x-4 items-center data-row mb-2">
                      <div className="flex-1 mb-4 md:mb-0">
                        <p className="font-bold text-base text-primary">{type.displayName}</p>
                        <p className="font-normal text-base text-gray-600">{type.description}</p>
                      </div>
                      <div className="w-full md:w-3/4 lg:w-2/6">
                        <RenderRow register={register} errors={errors} control={control} salesStagesOptions={salesStagesOptions} type={type} />
                      </div>
                    </div>
                    <ThresholdAccordion>
                      <h4 className="text-base text-black uppercase mb-1">{type.sampleEventText}</h4>
                      <p className="font-normal text-base text-gray-600 mb-2">{type.sampleEventDetailed}</p>
                    </ThresholdAccordion>
                  </div>
                ))}
              </div>
            ))}
        </form>
      </ContentFrame>

      {thresholdPermission?.capabilities?.EDIT && (
        <ContentFooter>
          <Button loading={setThresholdLoading} onClick={handleSubmit(onSubmit)} classes="mx-auto md:mx-0 lg:mx-0">
            Save
          </Button>
          <Button classes="mx-auto md:mx-0 lg:mx-0" onClick={() => navigate(-1)} style="bg-none">
            Cancel
          </Button>
        </ContentFooter>
      )}
    </>
  );
}
