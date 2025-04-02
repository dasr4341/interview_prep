import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Integration.scss';
import { useMutation } from '@apollo/client';
import { updateConnectorMutation } from 'lib/mutation/integration/update-integration';
import catchError from 'lib/catch-error';
import { toast } from 'react-toastify';
import { PretaaConnectorFormFieldInput, UpdateConnectorVariables } from 'generatedTypes';
import { successList } from '../../../../lib/message.json';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function IntegrationDetailScreen() {
  const navigate = useNavigate();
  const selectedIntegration = JSON.parse(sessionStorage.getItem('selectedIntegration') || '');
  // Hooks for updating a existing email template
  const [updateIntegration, { loading: updateIntegrationLoading }] = useMutation(updateConnectorMutation);
  // Form Object
  const [formData, setFormData] = useState({});

  const handleChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Sending creating and updating request
  async function onSubmit() {
    try {
      const authDataObj: PretaaConnectorFormFieldInput[] = Object.entries(formData)?.map(([key, value]) => {
        return { name: key as string, value: value as string };
      });
      const updateVariables: UpdateConnectorVariables = {
        connectorAuthData: authDataObj,
        updateUrl: selectedIntegration?.authData?.actionUrl,
      };
      await updateIntegration({
        variables: updateVariables,
      });
      navigate(-1);
      toast.success(successList.integrationUpdate);
    } catch (e) {
      catchError(e, true);
    }
  }

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.integrationDetails.name,
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <ContentHeader title="Integrations" />
      <ContentFrame className="flex-1">
        <div className="max-w-xl">
          <div className="flex items-center">
            <span
              className="w-32 h-32 border rounded-full bg-white
              flex items-center justify-center mr-4 integration-list">
              <img src={`data:image/jpeg;base64,${selectedIntegration?.icon}`} alt="logo" className="inline-block image" />
            </span>
            <div className="space-y-2">
              <h2 className="h2 uppercase">{selectedIntegration?.sourceName}</h2>
            </div>
          </div>
          {selectedIntegration?.authData?.formData?.map((x: any) => {
            return (
              <div className="grid space-y-1 mt-6" key={x.name}>
                <label htmlFor="name" className="form-label capitalize">
                  {x.display_name}
                </label>
                <input placeholder={x.placeholder} type="text" className="input" name={x.name} onChange={(e) => handleChange(x.name, e.target.value)} />
              </div>
            );
          })}
          {/* <div className="mt-6">
            <label className="switch mr-2">
              <input type="checkbox" />
              <span className="slider round"></span>
            </label>
            <span className="uppercase text-primary text-sm font-semibold">Enabled</span>
          </div> */}
        </div>
      </ContentFrame>
      <div className="bg-white p-5 sm:px-15 lg:px-16 flex">
        <Button classes="mx-auto mb:mx-0 lg:mx-0" loading={updateIntegrationLoading} disabled={updateIntegrationLoading} onClick={onSubmit}>
          Save
        </Button>
        <Button text="Cancel" style="other" onClick={() => navigate(-1)} />
      </div>
    </div>
  );
}
