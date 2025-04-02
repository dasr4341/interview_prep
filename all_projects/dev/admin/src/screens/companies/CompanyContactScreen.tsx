import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { LabeledValue } from 'components/LabeledValue';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import {
  GetUniqueContact,
  GetUniqueContactVariables,
} from 'generatedTypes';
import { GetUniqueContactQuery } from 'lib/query/contacts/get-contacts';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { routes } from 'routes';
import NameInitials from 'components/ui/nameInitials/NameInitials';
import { TrackingApi } from 'components/Analytics';
import { useEffect } from 'react';

export function Loading() {
  return (
    <div className="ph-item">
      <div className="ph-col-12">
        <div className="ph-row">
          <div className="ph-col-6"></div>
          <div className="ph-col-4 empty"></div>
          <div className="ph-col-2"></div>
        </div>
      </div>
    </div>
  );
}

export default function CompanyContactScreen(): JSX.Element {
  const { id }: { id?: string } = useParams() as any;

  const { loading, error, data } = useQuery<GetUniqueContact, GetUniqueContactVariables>(GetUniqueContactQuery, {
    variables: {
      contactId: String(id),
    },
  });

  const contact = data?.pretaaFindUniqueContact;

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.companyContact.name,
    });
  }, []);

  return (
    <>
      <ContentHeader title={`${contact?.firstName} ${contact?.lastName} Contact`} />
      <ContentFrame>
        {error && <ErrorMessage message={error.message} />}
        {loading && !data && <Loading />}
        {!loading && (
          <div
            className="flex items-center space-x-4 p-6 
          bg-white border-b rounded-t-xl">
            <NameInitials name={`${contact?.firstName} ${contact?.lastName}`} />
            <div className="flex-1" data-test-id="primary_contact_header">
              <label className="block font-bold">
                {contact?.firstName} {contact?.lastName}
              </label>
              {contact?.primary && <span className="text-gray-600 font-semibold  text-xs">Primary Contact</span>}
            </div>
          </div>
        )}

        <div
          className="grid px-5 py-6 my-5 bg-white border border-gray-200 
            md:grid-cols-3 gap-y-6 rounded-xl">
          <LabeledValue label="Company">
            <Link to={routes.companyDetail.build(`${contact?.companyId}`)}>
              <a className="font-medium text-pt-blue-300 underline ">{contact?.company?.name}</a>
            </Link>
          </LabeledValue>
          <LabeledValue label="Work Phone" className="col-span-2 font-medium">
            {contact?.workPhone}
          </LabeledValue>
          <LabeledValue label="Personal Phone" className='font-medium'>
            {contact?.mobilePhone}
          </LabeledValue>
          <LabeledValue label="Email" className="col-span-2 font-medium">
            {contact?.email}
          </LabeledValue>
        </div>
      </ContentFrame>
    </>
  );
}
