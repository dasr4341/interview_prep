import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { GetLaunchQuery } from 'lib/query/launch/get-launch';
import { GetLaunch, GetLaunchVariables, GetLaunch_pretaaGetLaunchAction_event } from 'generatedTypes';
import SafeHtml from 'components/SafeHtml';
import EventView from 'screens/events/components/EventView';
import { routes } from 'routes';
import DateFormat from 'components/DateFormat';
import NameInitials from 'components/ui/nameInitials/NameInitials';
import { NavigationHeader } from 'components/NavigationHeader';
import { TrackingApi } from 'components/Analytics';

export function Loading() {
  return (
    <>
      <div className="ph-item">
        <div className="ph-col-12">
          <div className="ph-row">
            <div className="ph-col-6"></div>
            <div className="ph-col-4 empty"></div>
            <div className="ph-col-2"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function LaunchDetailScreen() {
  const { launchId } = useParams() as any;
  const [getLaunch, { data: launch, loading }] = useLazyQuery<GetLaunch, GetLaunchVariables>(GetLaunchQuery);

  const launchDetail = launch?.pretaaGetLaunchAction;

  useEffect(() => {
    if (launchId) {
      getLaunch({
        variables: {
          id: launchId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchId]);

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.launchedDetail.name,
    });
  }, []);

  return (
    <>
      <ContentHeader>
        <NavigationHeader>
          <div className="flex flex-row items-center justify-between">
            <div className="block relative text-primary mb-0 mt-2 cursor-pointer" data-test-id="page-title">Launch Detail</div>
          </div>
        </NavigationHeader>
      </ContentHeader>

      <ContentFrame>
        {loading && <Loading />}

        {launchDetail?.event && (
          <EventView event={launchDetail?.event as GetLaunch_pretaaGetLaunchAction_event} options="hide" wrapperClassName="bg-white rounded-xl border-gray-200 mb-6" />
        )}
        {launchDetail && (
          <>
            <div className="border-t border-b border-gray-350 py-3 flex flex-row items-center justify-between">
              <div className="flex flex-row space-x-2 items-center">
                <NameInitials name={launchDetail?.launch?.user?.firstName + ' ' + launchDetail?.launch?.user?.lastName} />
                <div className="flex flex-col space-y-1">
                  <div className="font-bold">{launchDetail?.launch?.user?.firstName + ' ' + launchDetail?.launch?.user?.lastName}</div>
                  <div className="text-xs flex-wrap">
                    To:{' '}
                    {launchDetail?.launch?.launchContacts.map((contact, i) => {
                      const contactsLength = launchDetail.launch.launchContacts.length;
                      let sendToAddress: string[] | undefined;
                      if (launchDetail.launch.sendToAddress?.trim() !== '') {
                        sendToAddress = launchDetail.launch.sendToAddress?.split(',');
                      }
                      return (
                        <span key={contact.contact.id} className="text-gray-600" data-test-id="mailing-name">
                          {contact.contact.name}
                          {contactsLength - 1 !== i ? ', ' : ''}
                          {sendToAddress && contactsLength - 1 === i && sendToAddress.length > 0 ? ', ' : '' }
                        </span>
                      );
                    })}
                    {/* eslint-disable-next-line max-len */}
                    {launchDetail.launch.sendToAddress?.trim() !== '' &&
                      launchDetail?.launch?.sendToAddress?.split(',').map((contact, i) => {
                        const sendToAddress = launchDetail?.launch?.sendToAddress?.split(',');
                        return (
                          <span key={contact} className="text-gray-600" data-test-id="mailing-name">
                            {contact}
                            {sendToAddress && sendToAddress.length - 1 === i ? '' : ', ' }
                          </span>
                        );
                      })}
                  </div>
                </div>
              </div>
              <span className="text-sm text-gray opacity-50">
                <DateFormat date={launchDetail?.launch?.createdAt} />
              </span>
            </div>
            <div className="border-b border-gray-350 py-3 flex flex-row space-x-2">
              <span className="text-gray-600 flex-none">Subject: </span>
              <span className="text-black">{launchDetail?.launch?.subject}</span>
            </div>
            <div className="flex items-center mt-8">
              <div className="flex-1">
                <SafeHtml rawHtml={launchDetail?.launch?.text as string} className="text-black email-content" />
              </div>
            </div>
          </>
        )}
      </ContentFrame>
    </>
  );
}
