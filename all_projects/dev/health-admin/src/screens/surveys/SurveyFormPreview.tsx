import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import { Slider } from '@mantine/core';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BsChevronDown } from 'react-icons/bs';
import { routes } from 'routes';
import { isArray, range } from 'lodash';
import { toast } from 'react-toastify';
import { ContentHeader } from 'components/ContentHeader';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import Button from 'components/ui/button/Button';
import { DynamicInputRange, SurveyField, SurveyFormSchema } from 'interface/dynamic-field-data.interface';
import Popover, { PopOverItem } from 'components/Popover';
import { CustomFieldErrors, GetErrorMessage } from './components/GetError';
import { useLazyQuery, useMutation } from '@apollo/client';
import catchError, { getGraphError } from 'lib/catch-error';
import {
  GetPatientSurveyVariables,
  GetPatientSurvey,
  SurveyAttemptCreateArgsFieldSet,
  GetSurveyTemplateVariables,
  GetSurveyTemplate,
  GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields,
  SubmitSurvey,
  SubmitSurveySignature,
  SubmitSurveySignatureVariables,
  SubmitSurveyVariables,
  GetPatientSurvey_pretaaHealthGetPatientSurvey,
  UserTypeRole,
  SurveyTemplateTypes,
  UserPermissionNames,
} from 'health-generatedTypes';
import SurveyFormPreviewSkeletonLoading from './skeletonLoading/SurveyFormPreviewSkeletonLoading';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import { surveyDetailsQuery } from 'graphql/survey-details.query';
import { submitSurvey } from 'graphql/submit-survey.mutation';
import { getSurveyTemplateQuery } from 'graphql/getSurveyTemplate.query';
import NoDataFound from 'components/NoDataFound';
import { config } from 'config';
import SkeletonLoading from '../../components/SkeletonLoading';
import { SignatureCanvasComponent } from '../../components/signature-canvas/signatureCanvas';
import { submitSurveySignature } from 'graphql/submitSurveySignature.mutation';
import { InputTypeEnum } from 'Helper/TransformJsonData';
import * as Bowser from 'bowser';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import messagesData from 'lib/messages';
import './_survey-form-preview.scoped.scss';
import EventCardView from 'screens/EventsScreen/component/EventCard';
import { format } from 'date-fns';
import useSelectedRole from 'lib/useSelectedRole';
import { compareAsPerOperator } from './lib/compareAsPerOperator.lib';

const pageDefaultColor = '#2563eb';

export const barStyles = {
  bar: { backgroundColor: pageDefaultColor },
  thumb: { backgroundColor: '#ffffff', border: `4px solid ${pageDefaultColor}` },
  track: { backgroundColor: pageDefaultColor },
  markFilled: { backgroundColor: pageDefaultColor, borderColor: pageDefaultColor },
  mark: { backgroundColor: pageDefaultColor },
  label: { lineHeight: 1, top: '-30px', padding: '6px 8px' },
};

export const barStylesDisable = {
  bar: { backgroundColor: 'transparent' },
  thumb: { backgroundColor: 'transparent', border: '4px solid transparent' },
  track: { backgroundColor: 'transparent' },
  markFilled: { backgroundColor: 'transparent' },
  mark: { backgroundColor: 'transparent' },
};

export default function SurveyFormPreview() {
  const isPatient = useSelectedRole({ roles: [UserTypeRole.PATIENT] });
  

  const campaignSchedulePrivilege = useGetPrivilege(
    UserPermissionNames.CAMPAIGN_SCHEDULER,
    CapabilitiesType.CREATE
  );
  const { templateId, surveyId, eventId } = useParams();
  const location = useLocation();
  const [surveyData, setSurveyData] = useState<GetPatientSurvey_pretaaHealthGetPatientSurvey | null>(null);
  const [surveySubmitLoading, setSurveySubmitLoading] = useState(false);
  const [signatureShowValidation, setSignatureShowValidation] = useState(false);
  const [signatureBase64, seSignatureBase64] = useState<string>('');
  const [skippedQuestionIds, setSkippedQuestionIds] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [formFields, setFormField] = useState<SurveyFormSchema>();
  const navigate = useNavigate();
  const [startTime] = useState(new Date());
  const browserElement = Bowser.parse(window.navigator.userAgent);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
    control,
    trigger,
    setValue,
    getValues,
    clearErrors,
  } = useForm({
    mode: 'onSubmit',
  });

  function addSkiableQuestionIds(surveyFields: GetPatientSurvey_pretaaHealthGetPatientSurvey_surveyFields[] | null) {
    // setting the values for the skipped ones, identifying the same
    const questionIdToSkip: number[] = [];

    let startSkipIndex: number | null = null;
    let endSkipIndex: number | null = null;

    surveyFields?.forEach((item, index) => {
      if (
        !!item?.validation?.conditionalValidation &&
        compareAsPerOperator(
          '',
          String(item?.validation?.conditionalValidation?.value),
          item?.validation?.conditionalValidation?.operator
        )
      ) {
        startSkipIndex = index;

        if (!!endSkipIndex && Number(item?.validation?.conditionalValidation?.skip) > endSkipIndex) {
          endSkipIndex = Number(item?.validation?.conditionalValidation?.skip);
        }

        if (!endSkipIndex) {
          endSkipIndex = Number(item?.validation?.conditionalValidation?.skip);
        }
      }

      if (!!startSkipIndex && !!endSkipIndex && index > startSkipIndex && index < endSkipIndex) {
        questionIdToSkip.push(index);
      } else if (String(item.inputType) === InputTypeEnum.RANGE) {
        setValue(
          `${item.id}.value`,
          (item.rangeValue
            ? Number(item.rangeValue.split(',')[0] || 0) + Number(item.rangeValue.split(',')[1] || 100)
            : 100) / 2
        );
      }
    });
    setSkippedQuestionIds(questionIdToSkip.length ? questionIdToSkip : []);
  }

  const [getPatientForm, { data: getPatientFormPreviewData, loading: getPatientPreviewLoading }] = useLazyQuery<
    GetPatientSurvey,
    GetPatientSurveyVariables
  >(surveyDetailsQuery, {
    onCompleted: (d) => {
      if (d.pretaaHealthGetPatientSurvey) {
        const response = d.pretaaHealthGetPatientSurvey;
        setFormField({
          id: String(response.id),
          surveyName: String(response.surveyTemplate?.title),
          isSignatureRequired: Boolean(response.isSignatureRequired),
          fields: response.surveyFields as SurveyField[],
        });
        addSkiableQuestionIds(response.surveyFields);
        setSurveyData(d.pretaaHealthGetPatientSurvey);
        setSignatureShowValidation(Boolean(response.isSignatureRequired));
      }
    },
    onError: (e) => {
      catchError(e, true);
      navigate(-1);
    },
  });

  const [submitSurveyForm, { loading: formSubmitting }] = useMutation<SubmitSurvey, SubmitSurveyVariables>(
    submitSurvey,
    {
      onCompleted: (d) => {
        setSurveySubmitLoading(false);
        toast.success(messagesData.successList.assessmentSubmit);
        if (d?.pretaaHealthSubmitSurvey) {
          navigate(routes.patientSurveyList.open.build({ showModal: true }));
        }
      },
      onError: (e) => {
        catchError(e, true);
        setSurveySubmitLoading(false);
      },
    }
  );

  const [uploadSignature] = useMutation<SubmitSurveySignature, SubmitSurveySignatureVariables>(submitSurveySignature, {
    onError: (e) => {
      setSurveySubmitLoading(false);
      catchError(e, true);
    },
  });


  const onSubmit = async (data: any) => {
    setSurveySubmitLoading(true);

    const fieldsJson = {
      ...formFields,
      fields: formFields?.fields.map((e) => {
        let value = '';
        if (e.inputType === 'checkbox' && isArray(data[e.id].value)) {
          value = data[e.id].value.join(',');
        } else if (e.inputType === 'dropdown' && data[e.id].value) {
          value = data[e.id].value.value;
        } else if (e.inputType === 'range' && data[e.id].value) {
          value = String(data[e.id].value);
        } else if (
          e.inputType === 'date' ||
          e.inputType === 'html' ||
          e.inputType === 'radio' ||
          e.inputType === 'text' ||
          e.inputType === 'textarea'
        ) {
          value = data[e.id]?.value;
        } else {
          value = data[e.id]?.value;
        }
        const { parentQuestionName, questionName, ...neededFields } = e;
        return {
          ...neededFields,
          value: String(value),
        };
      }),
    } as SurveyFormSchema;

    const params: SubmitSurveyVariables = {
      surveyId: String(surveyId),
      surveyFields: fieldsJson.fields as SurveyAttemptCreateArgsFieldSet[],
      isCompleted: true,
      browser: `${browserElement.browser.name} ${browserElement.browser.version}`,
      os: browserElement.os.name,
      device: browserElement.platform.type,
      surveyStartedAt: startTime.toISOString(),
      surveyFinishedAt: new Date().toISOString(),
    };


    if (signatureBase64) {
      clearErrors('signature');
      uploadSignature({
        variables: {
          surveyId: String(surveyId),
          surveySignatureData: signatureBase64,
        },
        onError: (e) => catchError(e, true),
        onCompleted: (d) => {
          if (d && d.pretaaHealthSubmitSurveySignature) {
            params.signature =
              d?.pretaaHealthSubmitSurveySignature && String(d?.pretaaHealthSubmitSurveySignature?.data);

            submitSurveyForm({
              variables: params,
            });
          }
        },
      }).finally(() => {
        setSurveySubmitLoading(false);
      });
    } else {
      submitSurveyForm({
        variables: params,
      });
    }
  };

  // ****** GETTING TEMPLATE DATA *********
  const [getTemplateDataCallBack, { loading: getTemplateDataLoading, error: getTemplateDataError, data: template }] =
    useLazyQuery<GetSurveyTemplate, GetSurveyTemplateVariables>(getSurveyTemplateQuery, {
      onCompleted: (d) => {
        if (d.pretaaHealthGetTemplate && d.pretaaHealthGetTemplate.surveyTemplateFields) {
          const response = d.pretaaHealthGetTemplate;
          setFormField({
            id: String(response.id),
            description: String(response.description),
            surveyName: String(response.title),
            fields: response.surveyTemplateFields as SurveyField[],
          });
          response.surveyTemplateFields?.forEach((item) => {
            if (String(item.inputType) === InputTypeEnum.RANGE) {
              setValue(
                `${item.id}.value`,
                (item.rangeValue
                  ? Number(item.rangeValue.split(',')[0] || 0) + Number(item.rangeValue.split(',')[1] || 100)
                  : 100) / 2
              );
              trigger(`${item.id}.value`);
            }
          });
        }
      },
      onError: (e) => {
        catchError(e, true);
        navigate(-1);
      },
    });
  // ******************************

  function handleOnChangeQuestionValue(item: SurveyField, value: string, index: number, fieldsAllData: SurveyFormSchema) {
    if (
      item.inputType === 'checkbox'
      && !(getValues(`${item.id}.value`).length)
    ) {
      setValue(`${item.id}.value`, value);
    }
    if (item.inputType !== 'dropdown' &&  item.inputType !== 'checkbox' && item.inputType !== 'date') {
      setValue(`${item.id}.value`, value);
    }
    trigger(`${item.id}.value`);

    /**
     * Todo: Code smell 
     * Todo: Refactor Needed 
     * Set skipped questions 
     */
    if (item.validation?.conditionalValidation) {
      let rangeFieldState: number[] = [];

      setSkippedQuestionIds((e) => {
        rangeFieldState = e;
        return e;
      });

      if (!!skippedQuestionIds.length) {
        rangeFieldState = skippedQuestionIds;
      }

      const startSkipIndex = index + 1;
      const endSkipIndex = item.validation.conditionalValidation?.skip - 1;

      if (
        compareAsPerOperator(
          value,
          String(item?.validation?.conditionalValidation?.value),
          item?.validation?.conditionalValidation?.operator
        ) &&
        !rangeFieldState.includes(index + 1)
      ) {
        const questionIdToSkip: number[] = [];
        for (let i = startSkipIndex; i <= endSkipIndex; i++) {
          clearErrors(`${fieldsAllData.fields[i].id}.value`);
          questionIdToSkip.push(i);
        }
        if (!!questionIdToSkip.length) {
          setSkippedQuestionIds((fieldId) => [...fieldId, ...questionIdToSkip]);
        }
        return;
      }


      if (
        !compareAsPerOperator(
          value,
          String(item?.validation?.conditionalValidation?.value),
          item?.validation?.conditionalValidation?.operator
        ) &&
        rangeFieldState.includes(index + 1)
      ) {

        setSkippedQuestionIds((state) => state.filter((f) => !(f >= startSkipIndex && f <= endSkipIndex)));

        skippedQuestionIds.forEach(id => {
          const fieldEnabled = fieldsAllData.fields[Number(id)];
          if (String(fieldEnabled.inputType) === InputTypeEnum.RANGE) {
            const rangeValue = (fieldEnabled as DynamicInputRange)
              ?.rangeValue;
  
            setValue(
              `${fieldEnabled.id}.value`,
              (rangeValue
                ? Number(rangeValue.split(',')[0] || 0) +
                Number(rangeValue.split(',')[1] || 100)
                : 100) / 2
            );
            trigger(`${fieldEnabled.id}.value`);
          }
        })
        
      }

    }
  }

  const getPreviewRowTemplate = (item: SurveyField, index: number, fieldsAllData: SurveyFormSchema) => {
    const isQuestionSkippedAlready = Boolean(skippedQuestionIds.find((r) => r === index));

    if (isQuestionSkippedAlready) {
      setValue(`${item.id}.value`, null);
    }

    if (item.inputType === InputTypeEnum.TEXT) {
      return (
        <input
          className="rounded border-gray-350 w-full md:w-2/5 "
          type="text"
          disabled={isQuestionSkippedAlready || (templateId ? true : false)}
          placeholder={item.placeholder}
          {...register(`${item.id}.value`, {
            required:
              !isQuestionSkippedAlready && item.validation.required?.active ? item.validation.required?.message : false,
            maxLength: item.validation.maxLength?.active ? item.validation.maxLength.max : 0,
            minLength: item.validation.minLength?.active ? item.validation.minLength.min : 0,
            pattern: item.validation.patternValidation?.active
              ? new RegExp(item.validation.patternValidation?.pattern)
              : undefined,
            validate: (v) => {
              if (isQuestionSkippedAlready) {
                return true;
              }
              return (item.validation.required?.active ? !!v.trim().length : true);
            }
          })}
          onChange={(v) => {
            handleOnChangeQuestionValue(item, v.target.value || '', index, fieldsAllData);
          }}
        />
      );
    } else if (item.inputType === InputTypeEnum.TEXTAREA) {
      return (
        <textarea
          disabled={isQuestionSkippedAlready || (templateId ? true : false)}
          className={`rounded border-gray-350 w-full md:w-2/5 ${isQuestionSkippedAlready ? 'resize-none' : ''}`}
          placeholder={item.placeholder}
          {...register(`${item.id}.value`, {
            required:
              !isQuestionSkippedAlready && item.validation.required?.active ? item.validation.required?.message : false,
            maxLength: item.validation.maxLength?.active ? item.validation.maxLength.max : 0,
            minLength: item.validation.minLength?.active ? item.validation.minLength.min : 0,
            pattern: item.validation.patternValidation?.active
              ? new RegExp(item.validation.patternValidation?.pattern)
              : undefined,
            validate: (v) => {
              if (isQuestionSkippedAlready) {
                return true;
              }
              return (item.validation.required?.active ? !!v.trim().length : true)
            }
          })}
          onChange={(v) => {
            handleOnChangeQuestionValue(item, v.target.value || '', index, fieldsAllData);
          }}
        />
      );
    } else if (item.inputType === InputTypeEnum.RADIO) {
      return (
        <div className={`w-full ${item.options.length >= 5 ? 'sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5' :
         'sm:flex sm:space-x-4 flex-col sm:flex-row'}`}>
          {item.options.map((i) => (
            <label key={`${item.id}-${index}-${i.label}-radio`} className="flex mb-2">
              <div className="flex flex-row items-center">
                <input
                  disabled={isQuestionSkippedAlready || (templateId ? true : false)}
                  type="radio"
                  className="mx-2 w-5 h-5 rounded-circle border-transparent focus:border-transparent focus:ring-0"
                  value={String(i.value)}
                  {...register(`${item.id}.value`, {
                    required:
                      !isQuestionSkippedAlready && item.validation?.required?.active
                        ? item.validation.required?.message
                        : false,
                  })}
                  onChange={(v) => {
                    handleOnChangeQuestionValue(item, v.target.value || '', index, fieldsAllData);
                  }}
                />
                <div className={`text-base font-normal ${isQuestionSkippedAlready ? 'text-gray-500' : 'text-gray-900'}`}>{i.label}</div>
              </div>
            </label>
          ))}
        </div>
      );
    } else if (item.inputType === InputTypeEnum.CHECKBOX) {
      return (
        <div className="flex flex-col space-y-6">
          {item.options.map((i) => (
            <label key={`${item.id}.value`} className="flex items-center ">
              <input
                disabled={isQuestionSkippedAlready || (templateId ? true : false)}
                type="checkbox"
                className="mr-2 survey-form-checkbox"
                value={String(i.value)}
                {...register(`${item.id}.value`, {
                  required:
                    !isQuestionSkippedAlready && item.validation?.required?.active
                      ? item.validation.required?.message
                      : false,
                  validate: {
                    minChecked: (v) => {
                      if (item.validation?.minimumCheckedOptions?.active) {
                        if (v.length < item.validation?.minimumCheckedOptions.min) {
                          return item.validation.minimumCheckedOptions.message;
                        }
                      }
                    },
                    maxChecked: (v) => {
                      if (item.validation.maximumCheckedOptions?.active) {
                        if (v.length > item.validation.maximumCheckedOptions.max) {
                          return item.validation.maximumCheckedOptions.message;
                        }
                      }
                    },
                  },
                })}
                onChange={(v) => {
                  handleOnChangeQuestionValue(item, v.target.value || '', index, fieldsAllData);
                }}
              />
              <div className={`text-xsm font-normal ${isQuestionSkippedAlready ? 'text-gray-500' : 'text-gray-900'}`}> {i.label}</div>
            </label>
          ))}
        </div>
      );
    } else if (item.inputType === InputTypeEnum.DATE) {
      return (
        <div className="relative">
          <Controller
            control={control}
            name={`${item.id}.value`}
            rules={{
              required:
                !isQuestionSkippedAlready && item.validation.required?.active
                  ? item.validation.required.message
                  : false,
            }}
            render={(field) => (
              <div className="flex items-start justify-start rounded border border-gray-350 bg-white relative">
                <DatePicker
                  {...field}
                  placeholderText={item.placeholder ? item.placeholder : 'mm/dd/yyyy'}
                  className={`${location.pathname.includes('preview') ? 'cursor-default' : 'cursor-pointer' } 
                  border-none rounded choose-date focus:border-transparent
                  focus:outline-none outline-transparent w-full bg-transparent
                  relative z-40`}
                  dateFormat={config.dateFormat}
                  disabled={isQuestionSkippedAlready || (templateId ? true : false)}
                  onChange={(date) => {
                    if (date) {
                      setStartDate(date);
                      setValue(`${item.id}.value`, format(date, config.dateFormat));
                      trigger(`${item.id}.value`);
                      handleOnChangeQuestionValue(item, String(date) || '', index, fieldsAllData);
                    }
                  }}
                  formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
                  wrapperClassName="date-picker"
                  selected={startDate ? startDate : null}
                />
              </div>
            )}
          />
        </div>
      );
    } else if (item.inputType === InputTypeEnum.DROPDOWN) {
      return (
        <Controller
          control={control}
          name={`${item.id}.value`}
          rules={{
            required:
              !isQuestionSkippedAlready && item.validation.required?.active ? item.validation.required.message : false,
          }}
          render={({ field }) => (
            <Select
              isDisabled={isQuestionSkippedAlready || (templateId ? true : false)}
              placeholder={item.placeholder}
              {...field}
              className=" w-full md:w-1/3 z-10 app-react-select "
              styles={{
                control: (baseStyles) => ({
                  ...baseStyles,
                  borderRadius: '0.25rem',
                  borderColor: '#D8D8D8',
                }),
              }}
              options={item.options}
              onChange={(v) => {
                if (v) {
                  setValue(`${item.id}.value`, v);
                  trigger(`${item.id}.value`);
                  handleOnChangeQuestionValue(item, String(v), index, fieldsAllData);
                }
              }}
            />
          )}
        />
      );
    } else if (item.inputType === InputTypeEnum.RANGE) {
      return (
        <div className={'w-full flex gap-5 '} data-row={`field-type-${item.inputType}`}>
          <div
            className={`rounded
px-5 py-3 whitespace-nowrap text-xsm font-normal
${'opacity-40 cursor-not-allowed'}`}>
            {item.rangeValue ? Number(item.rangeValue.split(',')[0]) : 0}
          </div>
          <Controller
            control={control}
            name={`${item.id}.value`}
            rules={{
              required:
                !isQuestionSkippedAlready && item.validation?.required?.active
                  ? item.validation.required.message
                  : false,
            }}
            render={(field) => (
              <Slider
                disabled={isQuestionSkippedAlready || (templateId ? true : false)}
                className="w-full mt-3"
                {...field}
                min={item.rangeValue ? Number(item.rangeValue.split(',')[0] || 0) : 0}
                max={item.rangeValue ? Number(item.rangeValue.split(',')[1] || 100) : 100}
                onChange={(v) => {
                  handleOnChangeQuestionValue(item, String(v), index, fieldsAllData);
                  setValue(`${item.id}.value`, v);
                  trigger(`${item.id}.value`);
                }}
                value={isQuestionSkippedAlready ? 0 : getValues(`${item.id}.value`)}
                step={Number(item.step) || 1}
                labelAlwaysOn
                label={isQuestionSkippedAlready ? 0 : getValues(`${item.id}.value`)}
                styles={isQuestionSkippedAlready ? barStylesDisable : barStyles}
              />
            )}
          />
          <div className="rounded px-5 py-3 whitespace-nowrap text-xsm font-normal">
            {item.rangeValue ? Number(item.rangeValue.split(',')[1]) : 100}
          </div>
        </div>
      );
    }
  };

  function surveyPreview(previewData: SurveyFormSchema | undefined) {
    return previewData?.fields.map((item, index) => {
      let skipValue = item?.validation?.conditionalValidation?.value;
      if (
        !!item?.validation?.conditionalValidation?.skip &&
        (item.inputType === 'checkbox' || item.inputType === 'radio' || item.inputType === 'dropdown')
      ) {
        skipValue = (item as any)?.options?.find((o: any) => o.value === skipValue)?.label;
      }
      return (
        <div
          id={`${index}-skiable-field`}
          key={`${item.id}-preview-row`}
          data-id={item.id}
          className={`w-full ${item.validation?.required?.active && 'border-red-800'} ${
            item.parentQuestionName !== null && 'pl-6'
            }`}>
          <div className=" flex flex-row items-start justify-between space-x-5">
            <div className="w-full">
              {item.inputType !== 'html' && (
                <label
                  className={`font-bold preview-form-label
${Boolean(skippedQuestionIds.find((r) => r === index)) && 'text-gray-600'}`}>
                  {item.label}
                </label>
              )}
              {item.inputType === 'html' && (
                <div className=" preview-form-label html-label flex">
                  <div
                    className={`font-sans pl-1 ${
                      Boolean(skippedQuestionIds.find((r) => r === index)) && 'text-gray-600'
                      }`}
                    dangerouslySetInnerHTML={{
                      __html: item.label,
                    }}></div>
                </div>
              )}
            </div>
          </div>
          <div className="py-4 flex flex-col items-start w-full">
            {getPreviewRowTemplate(item, index, previewData)}
            {isSubmitted && (
              <GetErrorMessage item={item} errors={errors as unknown as CustomFieldErrors} />
            )}

          </div>
        </div>
      );
    });
  }

  const onSetSignatureBase64 = (base64Url: string) => {
    seSignatureBase64(base64Url);
    setValue('signature', base64Url);
    trigger('signature');
  };

  useEffect(() => {
    if (templateId) {
      getTemplateDataCallBack({
        variables: { templateId },
      });
    } else if (surveyId) {
      getPatientForm({
        variables: {
          surveyId,
        },
      });
    }
  }, [templateId, surveyId]);

  return (
    <div className="flex flex-col flex-1">
      <ContentHeader>
        <div className="flex flex-col md:flex-row md:justify-between text-primary mb-5 mt-2">
          <div className="w-full md:w-3/5">
            {getPatientPreviewLoading ||
              (getTemplateDataLoading && <SkeletonLoading />)}

            {!getPatientPreviewLoading && !getTemplateDataLoading && (
              <React.Fragment>
                <h1 className="h1 leading-none text-primary font-bold flex-1 text-md lg:text-lg">
                  {getPatientFormPreviewData
                    ? getPatientFormPreviewData?.pretaaHealthGetPatientSurvey
                      ?.surveyTemplate?.name
                    : template?.pretaaHealthGetTemplate?.name}
                </h1>
                <p className=" font-normal text-base text-justify">
                  {template?.pretaaHealthGetTemplate?.description ||
                    getPatientFormPreviewData?.pretaaHealthGetPatientSurvey
                      .surveyTemplate?.description ||
                    'N/A'}
                </p>
              </React.Fragment>
            )}
          </div>

          <div>
            {(location.pathname.includes(
              routes.templateFormPreview.build(String(templateId))
            ) && campaignSchedulePrivilege && 
            template?.pretaaHealthGetTemplate?.type === SurveyTemplateTypes.STANDARD && template.pretaaHealthGetTemplate.templateEnableStatus) && (
              <Button
                onClick={() => {
                  navigate(
                    routes.scheduleManagerDetail.scheduleCampaign.build(
                      String(templateId)
                    )
                  );
                    
                }
                }>
                Send assessment
              </Button>
            )}

          {/* for counsellor */}
            {((
              location.pathname.includes(routes.assessmentTemplatePreview.build(String(templateId)))) && 
              template?.pretaaHealthGetTemplate?.templateEnableStatus) && (
                <Button
                onClick={() => {
                  navigate(
                    routes.assessmentScheduleCreateCampaign.build(
                      String(templateId)
                    )
                  );
                }
                }>
                Send assessment
              </Button>
              )}
          
            {(location.pathname.includes(
              routes.templateFormPreview.build(String(templateId))
            ) &&
              template?.pretaaHealthGetTemplate?.type ===
                SurveyTemplateTypes.CUSTOM && campaignSchedulePrivilege) && (
                <Popover
                  trigger={
                    <Button>
                      Take action
                      <BsChevronDown
                        size={17}
                        className="ml-1"
                      />
                    </Button>
                  }>
                  <PopOverItem
                    onClick={() =>
                      navigate(
                        routes.updateTemplateForm.build(String(templateId))
                      )
                    }>
                    Edit Template
                  </PopOverItem>

                  {template.pretaaHealthGetTemplate.templateEnableStatus && 
                    <PopOverItem
                      onClick={() =>
                        navigate(
                          routes.scheduleManagerDetail.scheduleCampaign.build(
                            String(templateId)
                          )
                        )
                      }>
                      Send assessment
                    </PopOverItem>
                  }
                  
                </Popover>
              )}
          </div>
        </div>
      </ContentHeader>

      <ContentFrame className="flex flex-col flex-1">
      {eventId && 
        <div className={`mb-5 ${surveyData?.isCompleted ? '' : 'hidden' }`}>
          <EventCardView eventId={String(eventId)} />
        </div>}
        {formFields?.fields.length === 0 && (
          <div className="flex flex-col flex-1 justify-center">
            <NoDataFound
              type="NODATA"
              heading="No assessment fields are yet"
            />
          </div>
        )}

        {(getTemplateDataLoading || getPatientPreviewLoading) &&
          !formFields?.surveyName.length && (
            <>
              { range(0, 2).map(el => (
                <React.Fragment key={el}><SurveyFormPreviewSkeletonLoading /></React.Fragment>
              ))}
            </>
          )}

        {!getPatientPreviewLoading &&
          surveyData?.surveyTemplate?.templateInfo && (
            <div className="flex flex-col flex-1 pb-6">
              {surveyData?.surveyTemplate?.templateInfo}
            </div>
          )}

        {!getPatientPreviewLoading && surveyData?.surveyTemplate?.title && (
          <div className="flex flex-col pb-6">
            {surveyData?.surveyTemplate?.title}
          </div>
        )}

        {(!getTemplateDataLoading || !getPatientPreviewLoading) &&
          !!formFields?.surveyName.length && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col flex-1 pb-6">
              <div className="flex flex-col space-y-4 items-start flex-1">
                {surveyPreview(formFields)}
              </div>

              {(location.pathname.includes(
                routes.patientSurveyList.submit.matchPath
              ) ||
                location.pathname.includes(
                  routes.templateFormPreview.matchPath
                ) || location.pathname.includes(
                  routes.eventSurveySubmitPage.matchPath)
                ) && (
                <div>
                  {isPatient && (
                    <div className="my-2">
                      <label className="font-bold preview-form-label">
                        Signature
                      </label>
                      <SignatureCanvasComponent
                        seSignatureBase64={onSetSignatureBase64}
                        functionalityOff={false}
                      />
                      <input
                        {...register('signature', {
                          required: signatureShowValidation,
                          value: String(signatureBase64),
                        })}
                        hidden
                        value={String(signatureBase64)}
                      />
                      {errors.signature && (
                        <div className="text-red-800 text-sm margin-top-8 sentence-case mt-4 bg-red-50 px-2 py-1 rounded w-fit">
                          This signature is required
                        </div>
                      )}
                    </div>
                  )}

                    {isPatient && (
                      <Button
                        classes={'mt-4'}
                        loading={formSubmitting || surveySubmitLoading}
                        disabled={formSubmitting || surveySubmitLoading}>
                        Submit
                      </Button>
                    )}
                  </div>
                )}
            </form>
          )}
      </ContentFrame>

      {getTemplateDataError && (
        <ErrorMessageFixed
          message={getGraphError(getTemplateDataError.graphQLErrors).join(',')}
        />
      )}
    </div>
  );
}
