/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import SafeHtml from 'components/SafeHtml';
import NameInitials from 'components/ui/nameInitials/NameInitials';
import { GetHustle, GetHustleVariables } from 'generatedTypes';
import { useLazyQuery } from '@apollo/client/react';
import { GetHustleQuery } from 'lib/query/launch/get-hustle';

export default function HustleEmailDetails({ id }: { id: string }): JSX.Element {
  const [getHustle, { data: hustle }] = useLazyQuery<GetHustle, GetHustleVariables>(GetHustleQuery);
  console.log({ hustle });
  const hustleDetails = hustle?.pretaaGetHustleAction;

  useEffect(() => {
    if (id) {
      getHustle({
        variables: {
          id,
        },
      });
    }
  }, [id]);

  return (
    <>
      <div className="bg-white rounded-2xl p-5">
        <div className="border-b border-gray-350 py-3 flex flex-row items-center justify-between">
          <div className="flex flex-row space-x-2 items-center">
            <NameInitials name={hustleDetails?.user?.firstName + ' ' + hustleDetails?.user?.lastName} />
            <div className="flex flex-col space-y-1">
              <div className="font-bold">{hustleDetails?.user?.firstName + ' ' + hustleDetails?.user?.lastName}</div>
              <div className="text-xs flex-wrap">
                To:{' '}
                {hustleDetails?.hustleContacts.map((contact, i) => {
                  const contactsLength = hustleDetails?.hustleContacts.length;
                  let sendToAddress: string[] | undefined;
                  if (hustleDetails?.sendToAddress?.trim() !== '') {
                    sendToAddress = hustleDetails?.sendToAddress?.split(',');
                  }
                  return (
                    <span key={contact.contact.id} className="text-gray-600">
                      {contact.contact.name}
                      {contactsLength - 1 !== i ? ', ' : ''}
                      {sendToAddress && contactsLength - 1 === i && sendToAddress.length > 0 ? ', ' : '' }
                    </span>
                  );
                })}
                {/* eslint-disable-next-line max-len */}
                {hustleDetails?.sendToAddress?.trim() !== '' &&
                  hustleDetails?.sendToAddress?.split(',').map((contact, i) => {
                    const sendToAddress = hustleDetails?.sendToAddress?.split(',');
                    return (
                      <span key={contact} className="text-gray-600">
                        {contact}
                        {sendToAddress && sendToAddress.length - 1  === i ? ' ' : ',' }
                      </span>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-350 py-3 flex flex-row space-x-2">
          <span className="text-gray-600">Subject: </span>
          <span className="text-black">{hustleDetails?.subject}</span>
        </div>
        <div className="flex items-center mt-8">
          <div className="flex-1">
            <SafeHtml rawHtml={hustleDetails?.text as string} className="text-black" />
          </div>
        </div>
      </div>
    </>
  );
}
