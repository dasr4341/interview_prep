/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import SafeHtml from 'components/SafeHtml';
import NameInitials from 'components/ui/nameInitials/NameInitials';
import { GetLaunch, GetLaunchVariables } from 'generatedTypes';
import { useLazyQuery } from '@apollo/client/react';
import { GetLaunchQuery } from 'lib/query/launch/get-launch';

export function Loading() {
  return (
    <>
      <div className="ph-col-12">
        <div className="ph-row">
          <div className="ph-col-12"></div>
        </div>
        <div className="ph-row">
          <div className="ph-col-8"></div>
        </div>
        <div className="ph-row">
          <div className="ph-col-6"></div>
        </div>
      </div>
    </>
  );
}

export default function LaunchEmailDetails({
  id,
}: {
  id: string;
}): JSX.Element {

  const [getLaunch, { data: launch, loading }] = useLazyQuery<GetLaunch, GetLaunchVariables>(GetLaunchQuery);
  const launchDetail = launch?.pretaaGetLaunchAction?.launch;

  useEffect(() => {
    if (id) {
      getLaunch({
        variables: {
          id,
        },
      });
    }
  }, [id]);

  return (
    <>
      <div className="bg-white rounded-2xl p-5">
        {loading && <Loading />}
        {!loading && launchDetail &&
          <>
        <div className="border-b border-gray-350 py-3 flex flex-row items-center justify-between">
          <div className="flex flex-row space-x-2 items-center">
            <NameInitials name={launchDetail?.user?.firstName + ' ' + launchDetail?.user?.lastName} />
            <div className="flex flex-col space-y-1">
              <div className="font-bold">
                {launchDetail?.user?.firstName + ' ' + launchDetail?.user?.lastName}
              </div>
              <div className="text-xs flex-wrap">
                To:{' '}
                {launchDetail?.launchContacts.map((contact, i) => {
                  const contactsLength = launchDetail?.launchContacts.length;
                  let sendToAddress: string[] | undefined;
                  if (launchDetail?.sendToAddress?.trim() !== '') {
                    sendToAddress = launchDetail?.sendToAddress?.split(',');
                  }
                  return (
                    <span key={contact.contact.id} className="text-gray-600">
                      {contact.contact.name}
                      {contactsLength - 1 !== i ? ', ' : ''}
                      {(sendToAddress && contactsLength - 1 === i) && sendToAddress.length > 0 ?  ', ' : '' }
                    </span>
                  );
                })}
                {/* eslint-disable-next-line max-len */}
                {launchDetail?.sendToAddress?.trim() !== '' && launchDetail?.sendToAddress?.split(',').map((contact, i) => {
                  const sendToAddress = launchDetail?.sendToAddress?.split(',');
                  return (
                    <span key={contact} className="text-gray-600">
                      {contact}
                      {sendToAddress && sendToAddress.length - 1 === i ?  '' : ', ' }
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-350 py-3 flex flex-row space-x-2">
          <span className="text-gray-600">Subject: </span>
          <span className="text-black">{launchDetail?.subject}</span>
        </div>
        <div className="flex items-center mt-8">
          <div className="flex-1">
            <SafeHtml rawHtml={launchDetail?.text as string} className="text-black" />
          </div>
        </div>
        </>
        }
      </div>
    </>
  );
}
