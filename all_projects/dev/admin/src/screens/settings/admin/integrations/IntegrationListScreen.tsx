import Button from 'components/ui/button/Button';
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { routes } from 'routes';
import { Link } from 'react-router-dom';
import usePermission from 'lib/use-permission';
import oktaImage from '../../../../assets/images/okta.jpg';
import { LabeledValue } from 'components/LabeledValue';
import { BsPencil } from 'react-icons/bs';
import { range } from 'lodash';
import { UserPermissionNames } from 'generatedTypes';
import './Integration.scss';
import { TrackingApi } from 'components/Analytics';
import { useEffect } from 'react';

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

export default function IntegrationListScreen(): JSX.Element {
  const integrationPermission = usePermission(UserPermissionNames.INTEGRATIONS);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.integrationLists.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title="Integrations" disableGoBack={true} breadcrumb={false}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>{integrationPermission?.capabilities?.CREATE && <Button text="Add connection" classes="md:float-right" />}</div>
        </div>
      </ContentHeader>
      <ContentFrame>
        <div className="integration-list">
          <div className="bg-white border-not-last-child flex gap-4 items-center p-6 data-row">
            <div className="relative inline-block">
              <span className="flex items-center justify-center rounded-full image-container">
                <img src={oktaImage} alt="logo" className="inline-block image" />
              </span>
            </div>
            <div className="text-primary text-base break-all pl-3 flex-1 ">
              <h3 className="flex-1 text-base font-bold">Okta</h3>
              <label className="block text-xs font-medium text-gray-600">EMAIL/ACCOUNT CONNECTED</label>
            </div>
            <LabeledValue label="Type" className="flex-1">
              Restful API
            </LabeledValue>
            <LabeledValue label="Enabled" className="flex-1">
              Enabled
            </LabeledValue>
            <Link to={routes.integrationOkta.match}>
              <BsPencil className="" />
            </Link>
          </div>
        </div>
        {/* )} */}
      </ContentFrame>
    </>
  );
}
