import React, { useEffect } from 'react';
import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import okta from '../../../../../assets/images/okta.jpg';
import { useMutation } from '@apollo/client';
import { OktaUpdateMutation } from 'lib/mutation/integration/okta-update';
import { UpdateOktaClientDetails, UpdateOktaClientDetailsVariables } from 'generatedTypes';
import { toast } from 'react-toastify';
import { successList, errorList } from '../../../../../lib/message.json';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { useNavigate } from 'react-router-dom';

export default function OktaUpdateFormScreen() {
  const navigate = useNavigate();
  const [updateOktaSettings, { data: oktaSettings, loading }] = useMutation<UpdateOktaClientDetails, UpdateOktaClientDetailsVariables>(OktaUpdateMutation);

  const URL = /^(http|https)?:\/\/(\S+)?$/i;

  useEffect(() => {
    if (oktaSettings) {
      toast.success(successList.settingUpdate);
    }
  }, [oktaSettings]);

  const formSchema = yup.object().shape({
    clientId: yup.string().required(errorList.required),
    apikey: yup.string(),
    domain: yup.string().required(errorList.required).matches(URL, errorList.url),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateOktaClientDetailsVariables>({
    resolver: yupResolver(formSchema) as unknown as any,
  });

  function onSubmit(data: UpdateOktaClientDetailsVariables) {
    console.log(data);
    updateOktaSettings({
      variables: data,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col min-h-screen">
        <ContentHeader title="Okta Settings" />
        <ContentFrame className="flex-1">
          <div className="max-w-xl">
            <div className="flex items-center">
              <span
                className="w-32 h-32 border rounded-full bg-white
              flex items-center justify-center mr-4">
                <img src={okta} alt="Jira" />
              </span>
            </div>

            <div className="grid space-y-1 mt-6">
              <label htmlFor="clientId" className="form-label">
                Client Id
              </label>
              <input type="text" className="input" {...register('clientId')} id="clientId" />

              <ErrorMessage message={errors.clientId?.message ? errors.clientId?.message : ''} />
            </div>
            <div className="grid space-y-1 mt-6">
              <label htmlFor="description" className="form-label">
                Domain
              </label>
              <input type="text" className="input" {...register('domain')} id="description" />
              <ErrorMessage message={errors.domain?.message ? errors.domain?.message : ''} />
            </div>
            <div className="grid space-y-1 mt-6">
              <label htmlFor="apiKey" className="form-label">
                API key (optional)
              </label>
              <input type="password" className="input" {...register('apikey')} id="apiKey" />
              <ErrorMessage message={errors.apikey?.message ? errors.apikey?.message : ''} />
              <div className="text-sm text-gray-650">
                Follow this link to create an API token{' '}
                <a
                  className="link"
                  // eslint-disable-next-line max-len
                  href="https://developer.okta.com/docs/guides/create-an-api-token/main/#create-the-token"
                  target="_blank">
                  Link
                </a>
              </div>
            </div>
          </div>
        </ContentFrame>
        <div className="bg-white p-5 sm:px-15 lg:px-16 flex">
          <Button text="Save" disabled={loading} />
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
  );
}
