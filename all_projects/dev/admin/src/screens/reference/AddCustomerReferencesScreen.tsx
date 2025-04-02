/* eslint-disable react-hooks/exhaustive-deps */
import { ContentHeader } from 'components/ContentHeader';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { customStyleSelectBox, ValueContainer, OptionWithCheckbox, OptionItem } from 'components/ui/SelectBox';
import Button from 'components/ui/button/Button';
import catchError from 'lib/catch-error';
import { GetCompany, GetOfferOptions, GetCompanyVariables, CreateCompanyReferenceVariables, CompanyType, OfferedToOptions } from 'generatedTypes';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { CreateCompanyReferenceMutation } from 'lib/query/company/reference';
import { toast } from 'react-toastify';
import { GetCompanyQuery } from 'lib/query/company/get-company';
import CompanySearch from 'screens/companies/components/CompanySearch';
import { GetOfferOptionsQuery } from 'lib/query/company/get-offer-options';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import { routes } from 'routes';
import { errorList, successList } from '../../lib/message.json';
import { TrackingApi } from 'components/Analytics';

interface SelectOptions {
  value: number | string | boolean | undefined;
  label: string;
}

export default function AddReferencesScreen(): JSX.Element {
  const navigate = useNavigate();

  const [showState, setShowState] = useState(false);
  //company id ~ available only in reference add page
  const { id } = useParams() as any;

  const optionYesNO: SelectOptions[] = [
    { value: true, label: 'Yes' },
    { value: false, label: 'No' },
  ];

  //Default offers
  const [offersSelected, setOffersSelected] = useState<SelectOptions[]>([]);
  const [didTheyDoSelected, setDidTheyDoSelected] = useState<SelectOptions[]>([]);
  const [optionList, setOptionList] = useState<SelectOptions[]>([]);

  // Hooks for creating new reference
  const [createCompanyReference, { loading: createReferenceLoading }] = useMutation(CreateCompanyReferenceMutation);

  // Hooks for getting all the offer options
  const [getOfferOptions, { data: offerOptionsData }] = useLazyQuery<GetOfferOptions>(GetOfferOptionsQuery);

  // Setting default states for the input fields
  const [offeredTo, setOfferedTo] = useState<SelectOptions>();
  const [dealClosed, setDealClosed] = useState<SelectOptions>();
  const [servedAsReferenceAt, setServedAsReferenceAt] = useState(new Date());
  const [currentCompanyName, setCurrentCompanyName] = useState<string>('');

  const [offerOptions, setOfferOptions] = useState<SelectOptions[]>([]);

  const { data: companyName } = useQuery<GetCompany, GetCompanyVariables>(GetCompanyQuery, {
    variables: {
      companyId: id,
    },
  });

  // Schema for the Reference create form
  const addReferenceSchema = Yup.object().shape({
    servedAsReferenceBefore: Yup.boolean().nullable(),
    servedAsReferenceAt: Yup.date()
      .nullable()
      .default(new Date())
      .max(
        new Date(),
        `Date should be equal or earlier than 
        ${new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}`
      ),
    notes: Yup.string(),
    offeredTo: Yup.string().required(errorList.required),
    dealClosed: Yup.boolean(),
    servedAsReferenceForId: Yup.string(),
    offerOptions: Yup.array().min(0),
    companyId: Yup.string().default(String(id)),
    firstName: Yup.string(),
    lastName: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().email(errorList.email),
    position: Yup.string(),
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addReferenceSchema) as unknown as any,
  });

  useEffect(() => {
    setOptionList([
      { label: OfferedToOptions.YES, value: OfferedToOptions.YES },
      { label: 'YES, CONTRACT', value: OfferedToOptions.YES_CONTRACT },
      { label: 'NO', value: 'NO' },
    ]);
    getOfferOptions();
  }, []);

  useEffect(() => {
    if (companyName) {
      setCurrentCompanyName(companyName?.pretaaGetCompany?.name || '');
    }
  }, [companyName]);

  useEffect(() => {
    if (offerOptionsData) {
      const updatedOptions: SelectOptions[] = [];
      const options = offerOptionsData.pretaaGetCompanyOfferOptions || [];
      options.forEach((option) => {
        updatedOptions.push({
          label: option.offerType,
          value: option.id,
        });
      });
      setOfferOptions(updatedOptions);
    }
  }, [offerOptionsData]);

  // Sending creating request
  async function onSubmit(formValue: CreateCompanyReferenceVariables) {
    try {
      const didTheyDoObj = didTheyDoSelected.map((x) => {
        return {
          offerOptionBefore: true,
          offerOption: {
            connect: {
              id: x.value,
            },
          },
        };
      });
      const offersSelectedObj = offersSelected.map((x) => {
        return {
          offerOptionBefore: false,
          offerOption: {
            connect: {
              id: x.value,
            },
          },
        };
      });

      const createVariables = {
        ...formValue,
        companyId: String(id),
        offerOptions:
          offeredTo?.value !== 'NO'
            ? {
                create: [...didTheyDoObj, ...offersSelectedObj],
              }
            : {},
      };
      const { data } = await createCompanyReference({
        variables: createVariables,
      });
      if (data) {
        navigate(
          routes.companyReferences.build(String(id), {
            added: true,
            type: CompanyType.CUSTOMER,
          })
        );
        toast.success(successList.referenceCreate);
      }
    } catch (e) {
      catchError(e, true);
    }
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.addCustomerReference.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Reference" />
      <ContentFrame>
        <div className="w-full lg:w-9/12">
          <h1 className="h2 text-primary mb-3 lg:mb-7" data-test-id="reference-page-title">{currentCompanyName}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-5">
            <div>
              <label
                htmlFor="offerRef"
                className="block text-pt-gray-600
                font-normal text-base mb-2">
                Did they offer to be a reference?
              </label>
              <Select
                className={`basic-single rounded-lg mb-1
              bg-white`}
                styles={customStyleSelectBox}
                options={optionList}
                isSearchable={false}
                name="offeredTo"
                id="offeredTo"
                onChange={(value) => {
                  if (value) {
                    setOfferedTo(value);
                    setValue('offeredTo', value?.value);
                    trigger('offeredTo');
                  }
                }}
                components={{
                  Option: OptionItem,
                }}
                value={offeredTo}
              />
              <ErrorMessage message={errors?.offeredTo?.message} />
            </div>

            {offeredTo?.value !== 'NO' && (
              <div>
                <label htmlFor="servedRef" className="block text-pt-gray-600 mb-2 font-normal text-base">
                  What did they offer to do?
                </label>
                <Select
                  className={`basic-single rounded-lg mb-1
                bg-white`}
                  styles={customStyleSelectBox}
                  options={offerOptions}
                  isSearchable={true}
                  value={offersSelected}
                  name="offerOptions"
                  id="offerOptions"
                  onChange={(value) => {
                    if (value) {
                      const selected = value.map((val) => val.value);
                      setValue('offerOptions', selected);
                      setOffersSelected(value as unknown as SelectOptions[]);
                      trigger('offerOptions');
                    }
                  }}
                  isMulti
                  closeMenuOnSelect={false}
                  components={{
                    Option: OptionWithCheckbox,
                    ValueContainer,
                  }}
                  hideSelectedOptions={false}
                />
              </div>
            )}
            <div
              className="flex justify-between border-t border-b py-5
              border-gray-350">
              <label htmlFor="howServe" className="form-label">
                Have they served as a reference before?
              </label>
              <ToggleSwitch
                checked={showState}
                onChange={(v) => {
                  setShowState(v);
                  setValue('servedAsReferenceBefore', v);
                  console.log(showState, v);
                }}
              />
            </div>
            {showState && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="whoServed"
                      className="block text-pt-gray-600 
                    mb-2 font-normal text-base">
                      Who did they serve as reference for?
                    </label>
                    <CompanySearch
                      isReference={true}
                      componentId="servedAsReferenceForId"
                      companyId={id}
                      componentName="servedAsReferenceForId"
                      className={`basic-single rounded-lg mb-1
                    bg-white`}
                      onchange={(company) => {
                        if (company) {
                          setValue('servedAsReferenceForId', company.value);
                        } else {
                          setValue('servedAsReferenceForId', company);
                        }
                        trigger('servedAsReferenceForId');
                      }}
                      selectedValue={null}
                    />
                    <ErrorMessage message={errors?.servedAsReferenceForId?.message} />
                  </div>

                  <div>
                    <label
                      htmlFor="whoServed"
                      className="block text-pt-gray-600
                    mb-2 font-normal text-base">
                      When did they serve as a reference?
                    </label>

                    <div
                      className={`border mb-1
                  border-gray-300 rounded-lg relative text-gray-800 ref-date`}>
                      <DatePicker
                        maxDate={new Date()}
                        className={`border-0 rounded-lg w-full py-3 date-field
                    bg-white`}
                        name="servedAsReferenceAt"
                        id="servedAsReferenceAt"
                        onChange={(date: any) => {
                          setServedAsReferenceAt(date);
                          setValue('servedAsReferenceAt', date);
                          trigger('servedAsReferenceAt');
                        }}
                        selected={servedAsReferenceAt}
                      />
                    </div>
                    <ErrorMessage message={errors?.servedAsReferenceAt?.message} />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="offerRef"
                    className="block text-pt-gray-600
                font-normal text-base mb-2">
                    Did the deal close?
                  </label>
                  <Select
                    className={`basic-single rounded-lg mb-1
              bg-white`}
                    styles={customStyleSelectBox}
                    options={optionYesNO}
                    isSearchable={false}
                    name="dealClosed"
                    id="dealClosed"
                    onChange={(value) => {
                      if (value) {
                        setDealClosed(value);
                        setValue('dealClosed', value?.value);
                        trigger('dealClosed');
                      }
                    }}
                    components={{
                      Option: OptionItem,
                    }}
                    value={dealClosed}
                  />
                  <ErrorMessage message={errors?.dealClosed?.message} />
                </div>

                <div>
                  <label htmlFor="servedRef" className="block text-pt-gray-600 mb-2 font-normal text-base">
                    What did they do?
                  </label>
                  <Select
                    className={`basic-single rounded-lg mb-1
                  bg-white`}
                    styles={customStyleSelectBox}
                    options={offerOptions}
                    isSearchable={true}
                    value={didTheyDoSelected}
                    name="didTheyDo"
                    id="didTheyDo"
                    onChange={(value) => {
                      if (value) {
                        const selected = value.map((val) => val.value);
                        setValue('didTheyDo', selected);
                        setDidTheyDoSelected(value as unknown as SelectOptions[]);
                        trigger('didTheyDo');
                      }
                    }}
                    isMulti
                    closeMenuOnSelect={false}
                    components={{
                      Option: OptionWithCheckbox,
                      ValueContainer,
                    }}
                    hideSelectedOptions={false}
                  />

                  <ErrorMessage message={errors?.didTheyDo?.message} />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label htmlFor="companyInfo" className="form-label">
                Person from Reference Company Info
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <input type="text" id="firstName" {...register('firstName')} placeholder="First name" className="input w-full" />
                </div>
                <div>
                  <input type="text" id="lastName" {...register('lastName')} placeholder="Last name" className="input w-full" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <input type="text" id="position" {...register('position')} placeholder="position" className="input w-full" />
                </div>
                <div>
                  <input type="number" id="phone" {...register('phone')} placeholder="Office Phone" className="input w-full" />
                </div>
                <div>
                  <input type="email" id="email" {...register('email')} placeholder="Company Mail Id" className="input w-full" />
                  <ErrorMessage message={errors?.email?.message} />
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              <label htmlFor="notes" className="block text-pt-gray-600 mb-2 font-normal text-base">
                Additional Messages
              </label>
              <textarea
                className={`w-full text-black
               rounded-lg h-24 font-normal text-base
              bg-white border-gray-300`}
                placeholder="Served as a reference for a Food & Bev 
              company @Arance Co."
                {...register('notes')}></textarea>
              <ErrorMessage message={errors?.notes?.message} />
            </div>

            <div className="lg:col-span-2">
              <div className="flex">
                <Button type="submit" loading={createReferenceLoading} disabled={createReferenceLoading}>
                  Submit
                </Button>
                <Button
                  style="bg-none"
                  type="button"
                  onClick={() => {
                    navigate(-1);
                  }}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </div>
      </ContentFrame>
    </>
  );
}
