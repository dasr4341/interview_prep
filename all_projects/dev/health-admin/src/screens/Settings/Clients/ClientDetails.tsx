import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BsPencil } from 'react-icons/bs';
import { routes } from 'routes';
import { toast } from 'react-toastify';

import { ContentHeader } from '../../../components/ContentHeader';
import { useLazyQuery } from '@apollo/client';
import { AdminViewClient, AdminViewClientVariables } from 'health-generatedTypes';
import { viewClientDetails } from 'graphql/viewClient.query';
import ClientDetailsSkeletonLoading from './ClientDetailsSkeletonLoading';
import { getGraphError } from 'lib/catch-error';
import { formatDate } from 'lib/dateFormat';

export default function ClientDetails() {
  const { clientId } = useParams();

  const [clientDetail, { data: clientDetailData, loading: clientDetailsLoading }] = useLazyQuery<AdminViewClient, AdminViewClientVariables>(
    viewClientDetails,
    {
      variables: {
        accountId: String(clientId),
      },
      onError: (e) => toast.error(getGraphError(e.graphQLErrors).join(',')),
    }
  );

  useEffect(() => {
    clientDetail();
  }, []);

  return (
    <>
      <ContentHeader titleLoading={clientDetailsLoading} title={clientDetailData?.pretaaHealthAdminViewClient.name} className="lg:sticky" />
      <div className=" mt-12 w-11/12 mx-auto ">
        <>
          {/* Client Details Block 1 */}
          <div className="flex font-bold text-pt-blue-300 mb-3">
            <h2 className="mr-4 text-base text-pt-primary">Client Detail</h2>
            <Link to={routes.owner.editClient.build(String(clientId))}>
              <BsPencil size={20} />
            </Link>
          </div>
          {clientDetailsLoading && <ClientDetailsSkeletonLoading />}
          {!clientDetailsLoading && (
            <>
              <div className="bg-white px-5 py-8 rounded-xl flex flex-col border border-border mb-8">
                {/* client details */}
                <div className="border-b pb-8 border-gray-300">
                  <div className="grid grid-cols-2 gap-2 md:gap-0 md:grid-cols-3 ">
                    <div className="flex flex-col bg-white col-span-1">
                      <div className="text-gray-600 mb-2  text-xss font-medium">Client Name</div>
                      <div className="text-primary text-base font-normal">{clientDetailData?.pretaaHealthAdminViewClient.name || 'N/A'}</div>
                    </div>
                    <div className="flex flex-col bg-white col-span-1">
                      <div className="text-gray-600 mb-2  text-xss font-medium">Renewal Date</div>
                      <div className="text-primary text-base font-normal">
                        {' '}
                        {clientDetailData?.pretaaHealthAdminViewClient.renewalDate
                          ? formatDate({ date: clientDetailData.pretaaHealthAdminViewClient.renewalDate })
                          : 'N/A'}
                      </div>
                    </div>
                    <div className="flex flex-col bg-white col-span-1">
                      <div className="text-gray-600 mb-2  text-xss font-medium">Status</div>

                      <div>{clientDetailData?.pretaaHealthAdminViewClient.status ? 'Active' : 'Inactive'}</div>
                    </div>
                  </div>
                </div>
                {/* client details end */}

                {/* super admin details */}

                <div className="grid grid-cols-2 gap-2 md:gap-0 md:grid-cols-3 mt-4 md:mt-10 ">
                  <div className="flex flex-col bg-white col-span-1">
                    <div className="text-gray-600 mb-2  text-xss font-medium">Super Admin Name</div>
                    <div className="text-primary text-base font-normal">
                        {`${clientDetailData?.pretaaHealthAdminViewClient.superAdmin?.firstName ? clientDetailData.pretaaHealthAdminViewClient.superAdmin.firstName + '  ' + clientDetailData.pretaaHealthAdminViewClient.superAdmin.lastName : 'N/A'}`}
                    </div>
                  </div>
                  <div className="flex flex-col bg-white col-span-1">
                    <div className="text-gray-600 mb-2  text-xss font-medium">Email</div>
                    <div className="text-primary text-base font-normal">
                      {clientDetailData?.pretaaHealthAdminViewClient.superAdmin?.email || 'N/A'}
                    </div>
                  </div>
                </div>
                {/* super admin details end */}
              </div>
            </>
          )}
        </>
      </div>
    </>
  );
}
