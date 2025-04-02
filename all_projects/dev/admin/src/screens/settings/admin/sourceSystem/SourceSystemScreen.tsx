import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useMutation, useQuery } from '@apollo/client';
import { GetSourceConnectorTypes, OnboardMultiClient, OnboardMultiClientVariables } from 'generatedTypes';
import './SourceSystem.scss';
import { range } from 'lodash';
import { getSourceConnectorTypesQuery } from 'lib/query/source-system/get-connectors-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { customStyleSelectBox, OptionItem } from 'components/ui/SelectBox';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { OnboardMultiClientMutation } from 'lib/mutation/source-system/onboard-multi-client';
import _ from 'lodash';
import { RootState } from 'lib/store/app-store';
import { toast } from 'react-toastify';
import { yupResolver } from '@hookform/resolvers/yup';
import { getGraphError } from 'lib/catch-error';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export function Loading() {
  return (
    <>
      {range(0, 5).map((i) => (
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
interface SelectOptions {
  value: number | string | boolean | undefined;
  label: string;
}
interface OptionsListInterface {
  value: number | string | boolean | undefined;
  name: string;
}

export default function SourceSystemScreen(): JSX.Element {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [selectedOption, setSelectedOption] = useState<SelectOptions>();
  const { data, loading } = useQuery<GetSourceConnectorTypes>(getSourceConnectorTypesQuery);
  const [responseErrors, setResponseErrors] = useState<Array<string>>([]);

  const [updateDataSource, { loading: updating }] = useMutation<OnboardMultiClient, OnboardMultiClientVariables>(OnboardMultiClientMutation, {
    onError: (err) => {
      setResponseErrors(getGraphError(err.graphQLErrors));
    },
  });
  const schema = Yup.object().shape({
    configuration: Yup.object().shape({}),
  });

  const {
    handleSubmit,
    setValue,
    trigger,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const getOptionList = (list: OptionsListInterface[]) => {
    const arrayList = list.map((x) => {
      return { value: x.value, label: x.name };
    });
    return arrayList;
  };

  const onSubmit = async (formData: any) => {
    console.log({ formData });
    setResponseErrors([]);
    const formObj = _.cloneDeep(formData);
    const connectorsList: any[] = [];

    let i = 0;
    Object.entries(formObj)?.forEach(([key, value]) => {
      const selectedSource = data?.pretaaListConnectorTypes?.connnectors?.filter((x: any) => x.name == key);
      const connectorId = selectedSource[0]?.parameters?.filter((c: any) => c?.name == 'connectorTypeId');

      const obj: any = {
        url: formObj[key]?.url ? formObj[key]?.url : '',
        connectorTypeId: connectorId?.length > 0 ? connectorId[0]?.value : 0,
        ...(value as any),
      };

      if (i > 0) {
        connectorsList.push(obj);
      }

      i = i + 1;
    });

    const updateVariables: OnboardMultiClientVariables = {
      clientName: currentUser?.currentUser?.customer?.name as string,
      configuration: formObj?.configuration,
      connectors: connectorsList,
      description: '',
    };

    try {
      const response = await updateDataSource({
        variables: updateVariables,
      });
      if (response.data) {
        toast.success('Source System updated');
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    console.log(data?.pretaaListConnectorTypes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.pretaaListConnectorTypes]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.sourceSystem.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Source System" disableGoBack={true} breadcrumb={false} />
      <ContentFrame>
        {loading && <Loading />}
        {!loading && data?.pretaaListConnectorTypes?.connnectors && (
          <div className="source-system-list">
            <form onSubmit={handleSubmit(onSubmit)}>
              {data?.pretaaListConnectorTypes?.configuration?.map((x: any, index: number) => {
                return (
                  <div className="grid space-y-1 mt-6" key={index}>
                    <label htmlFor="name" className="form-label capitalize">
                      {x?.display_name}
                    </label>
                    {x?.type === 'string' && <input data-testid={x?.name} placeholder={x?.placeholder} type="text" className="input" {...register(`configuration.${x?.name}`)} />}
                    {errors && errors.configuration && <ErrorMessage message={errors?.configuration[x?.name]?.message} testId={`${x?.name}-error`} />}
                  </div>
                );
              })}
              {data?.pretaaListConnectorTypes?.connnectors?.map((source: any, i: number) => (
                <div key={i}>
                  <div className="bg-white border-not-last-child flex gap-4 items-center px-6 data-row mt-12" key={source.id}>
                    <div className="relative inline-block">
                      <span className="flex items-center justify-center rounded-full image-container">
                        <img src={`data:image/jpeg;base64,${source.icon}`} alt="logo" className="inline-block image" />
                      </span>
                    </div>
                    <div className="text-primary text-base break-all pl-3 flex-1 ">
                      <h3 className="flex-1 text-base font-bold capitalize">{source.name}</h3>
                    </div>
                  </div>
                  {source?.parameters?.map((x: any, index: number) => {
                    return (
                      <div className="grid space-y-1 mt-6 last:mb-0" key={index}>
                        <label htmlFor="name" className="form-label capitalize">
                          {x?.display_name}
                        </label>
                        {x?.type !== 'dropdown' && x.name !== 'connectorTypeId' && (
                          <input
                            placeholder={x?.placeholder}
                            type={x.type === 'password' ? 'password' : 'text'}
                            className="input"
                            {...register(`${source.name}.${x?.name}`)}
                            autoComplete="none"
                          />
                        )}
                        {x?.type === 'dropdown' && (
                          <Select
                            className="basic-single rounded-lg mb-1 bg-white"
                            styles={customStyleSelectBox}
                            options={getOptionList(x?.value)}
                            isSearchable={false}
                            name={x?.name}
                            id="dealClosed"
                            onChange={(value) => {
                              if (value) {
                                setSelectedOption(value);
                                setValue(`${source.name}.${x?.name}`, value?.value);
                                trigger(`${source.name}.${x?.name}`);
                              }
                            }}
                            components={{
                              Option: OptionItem,
                            }}
                            value={selectedOption}
                          />
                        )}
                        {errors && errors[source.name] && <ErrorMessage message={errors[source.name][x?.name]?.message} testId={`${x?.name}-error`} />}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div className="lg:col-span-2">
                <div className="flex">
                  <Button type="submit" loading={updating} disabled={updating}>
                    Save
                  </Button>
                </div>
              </div>
              <ErrorMessage message={responseErrors.join(',')}></ErrorMessage>
            </form>
          </div>
        )}
        {!loading && !data?.pretaaListConnectorTypes?.connnectors && <ErrorMessage message="No Connectors Available" />}
      </ContentFrame>
    </>
  );
}
