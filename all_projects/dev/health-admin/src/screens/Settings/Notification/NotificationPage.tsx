import { useLazyQuery, useMutation } from '@apollo/client';
import { ContentHeader } from 'components/ContentHeader';
import {
  PretaaHealthCreateUpdateUserNotificationSettings,
  PretaaHealthCreateUpdateUserNotificationSettingsVariables,
  PretaaHealthGetUserNotificationSettings,
  PretaaHealthGetUserNotificationSettings_pretaaHealthGetUserNotificationSettings,
  UserTypeRole,
} from 'health-generatedTypes';
import React, { useEffect, useState } from 'react';
import './_notification-page.scoped.scss';
import { userNotificationSettings } from 'graphql/userNotificationSettings.query';
import { userNotificationSettingsUpdate } from 'graphql/userNotificationSettingsUpdate.mutation';
import SkeletonLoading from 'components/SkeletonLoading';
import Button from 'components/ui/button/Button';
import { useForm } from 'react-hook-form';
import SwitchToggle from './Components/SwitchToggle';
import { toast } from 'react-toastify';
import { getGraphError } from 'lib/catch-error';
import messagesData from 'lib/messages';
import { ContentFooter } from 'components/content-footer/ContentFooter';
import useSelectedRole from 'lib/useSelectedRole';

interface NotificationTypeInterface {
  label: string;
  value?: boolean;
  key?: string;
  subTypes?: NotificationTypeInterface[];
}

export default function NotificationPage() {
  const [toggleData, setToggleData] = useState<PretaaHealthGetUserNotificationSettings_pretaaHealthGetUserNotificationSettings | null>(
    null
  );
  const [userNotificationSettingsData, { loading, data }] = useLazyQuery<PretaaHealthGetUserNotificationSettings>(userNotificationSettings);
  const isSuperAdmin = useSelectedRole({ roles: [UserTypeRole.SUPER_ADMIN] });

  const { handleSubmit, setValue, getValues, watch, control } = useForm({
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    userNotificationSettingsData();
  }, [userNotificationSettingsData]);

  useEffect(() => {
    if (data?.pretaaHealthGetUserNotificationSettings) {
      setToggleData(data.pretaaHealthGetUserNotificationSettings);
    }
  }, [data]);

  useEffect(() => {
    if (toggleData) {
      setValue('pauseAll', toggleData.pauseAll);
      setValue('notification', toggleData.notification);
      setValue('email', toggleData.email);
      toggleData.notificationTypesSetting.forEach((summary: NotificationTypeInterface) => {
        !summary.subTypes && setValue(summary.label, summary.value);
        summary.subTypes?.forEach((sub: NotificationTypeInterface) => {
          setValue(sub.label, sub.value);
        });
      });
    }
  }, [setValue, toggleData]);

  watch(['notification', 'pauseAll', 'email', 'text']);
  const isPauseAllOn = getValues('pauseAll');

  // Use Mutation Resolver

  const [placeNotificationSettings, { loading: onDataLoading }] = useMutation<
    PretaaHealthCreateUpdateUserNotificationSettings,
    PretaaHealthCreateUpdateUserNotificationSettingsVariables
  >(userNotificationSettingsUpdate, {
    onCompleted: () => {
      toast.success(messagesData.successList.notificationUpdate);
    },
    onError: (e) => toast.error(getGraphError(e.graphQLErrors).join(',')),
  });

  const updateNotificationSettings = () => {
    if (data?.pretaaHealthGetUserNotificationSettings) {
      const { pretaaHealthGetUserNotificationSettings } = data;
      const payloadForSF = {
        email: getValues('email'),
        pauseAll: getValues('pauseAll'),
        text: getValues('text'),
        notificationTypesSetting: pretaaHealthGetUserNotificationSettings?.notificationTypesSetting.map(
          (summary: NotificationTypeInterface) => {
            return !summary.subTypes
              ? { ...summary, value: getValues(summary.label) }
              : {
                  ...summary,
                  subTypes: summary.subTypes?.map((sub: NotificationTypeInterface) => {
                    return { ...sub, value: getValues(sub.label) };
                  }),
                };
          }
        ),
      };

      const payloadForAll = {
        ...payloadForSF,
        notification: getValues('notification'),
      }

      placeNotificationSettings({
        variables: isSuperAdmin ? payloadForSF : payloadForAll,
      });
    }
  };

  return (
    <div>
      <ContentHeader title="Notifications" disableGoBack={true} />
      <div className="text-primary">
        {loading && (
          <div className='mt-4'>
            {new Array(8).fill(<SkeletonLoading />).map((el) => <div key={el}>{el}</div>)}
          </div>
        )}
        {!loading && toggleData && (
          <form className="flex flex-col h-full" onSubmit={handleSubmit(updateNotificationSettings)}>
            <div className="px-5 py-5 lg:px-16 lg:py-8 sm:px-15 sm:py-10">
              <div className="flex flex-col">
                <div className="py-2 px-4 flex justify-between items-center pl-0">
                  <div className="text-base font-normal">Pause All</div>
                  <SwitchToggle control={control} setValue={setValue} name="pauseAll" />
                </div>
              </div>
              {!isPauseAllOn && (
                <div>
                  <div className="mt-2 border-gray-350 border-t">
                    <div className="mt-6 font-medium text-black other-notification-header"> Delivery Method</div>
                  </div>

                  {data?.pretaaHealthGetUserNotificationSettings?.notification !== null && (
                  <div className="flex flex-col">
                    <div className="py-3 px-4 flex justify-between items-center bg-white mt-6 rounded-lg">
                      <div className="text-base font-normal">Notifications</div>
                      <SwitchToggle control={control} setValue={setValue} name="notification" />
                    </div>
                  </div>
                  )}

                  {data?.pretaaHealthGetUserNotificationSettings?.email !== null && (
                  <div className="flex flex-col">
                    <div className="py-3 px-4 flex justify-between items-center bg-white mt-3 rounded-lg">
                      <div className="text-base font-normal">Emails</div>
                      <SwitchToggle control={control} setValue={setValue} name="email" />
                    </div>
                  </div>
                  )}
                  {toggleData.notificationTypesSetting.length > 0 && (
                    <div className="mt-8 border-gray-350 border-t">
                      <div className="mt-6 mb-6 font-medium text-black other-notification-header">Event Types Method</div>
                    </div>
                  )}

                  <div className="pb-28">
                    {toggleData.notificationTypesSetting.map((item, index) => {
                      return (
                        <div className="rounded-lg overflow-hidden mt-3" key={item.label || `subtype ${index}`}>
                          <div className="py-3 px-4 flex justify-between items-center bg-white">
                            <div className="text-base font-normal capitalize">{item.label}</div>
                            {!item.subTypes && <SwitchToggle control={control} setValue={setValue} name={item.label} />}
                          </div>
                          <div className="text-right float-right w-1/2">
                            {item.subTypes &&
                              item.subTypes.map((innerItems: any) => {
                                return (
                                  <div
                                    className="flex justify-between items-center rounded-lg bg-white py-3 px-4 mt-3"
                                    key={innerItems.label}>
                                    <p className="mr-3 capitalize">{innerItems.label}</p>
                                    <SwitchToggle control={control} setValue={setValue} name={innerItems.label} />
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 fixed bottom-0 w-full">
              <ContentFooter>
                <Button type="submit" disabled={onDataLoading} loading={onDataLoading}>
                  Update
                </Button>
              </ContentFooter>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
