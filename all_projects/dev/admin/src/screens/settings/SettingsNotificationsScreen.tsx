/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { ToggleSwitch } from 'components/ToggleSwitch/ToggleSwitch';
import Datetime from 'react-datetime';
import { BsPlus, BsX } from 'react-icons/bs';
import { useForm } from 'react-hook-form';
import Button from 'components/ui/button/Button';
import { useMutation, useQuery } from '@apollo/client';
import { UpdateUserNotification } from 'lib/query/settings/update-notification';
import { NotificationSettings, NotificationSettings_pretaaGetUserNotification_notificationSummary, UpdateNotification, UpdateNotificationVariables } from 'generatedTypes';
import { GetNotification } from 'lib/query/settings/get-notification';
import { useEffect, useState } from 'react';
import { Moment } from 'moment';
import _ from 'lodash';
import { toast } from 'react-toastify';
import catchError from '../../lib/catch-error';
import { format, isValid } from 'date-fns';
import { successList } from '../../lib/message.json';
import 'react-datetime/css/react-datetime.css';
import { TrackingApi } from 'components/Analytics';
import { routes } from 'routes';

export default function SettingsNotificationsScreen(): JSX.Element {
  const { data: notificationSettings } = useQuery<NotificationSettings>(GetNotification);
  const [submitNotification, { loading }] = useMutation<UpdateNotification, UpdateNotificationVariables>(UpdateUserNotification);
  const [schedules, setSchedules] = useState<NotificationSettings_pretaaGetUserNotification_notificationSummary[]>([]);
  const [receiveEmailsFlag, setReceiveEmailsFlag] = useState(false);
  const [pauseAllFlag, setPauseAllFlag] = useState(false);

  interface FormFields {
    notificationSummaryFlag: boolean;
    favoritedCompaniesFlag: boolean;
  }

  const { handleSubmit, setValue, getValues, watch } = useForm<FormFields>();
  const onSubmit = async (formData: any) => {
    try {
      let times = _.cloneDeep(schedules).map((t) => {
        const timeSchedule = new Date(t.scheduleTime);
        if (isValid(timeSchedule)) {
          t.scheduleTime = format(new Date(t.scheduleTime), 'yyyy/MM/dd HH:mm');
        } else {
          const time = t.scheduleTime.split(':');
          t.scheduleTime = format(new Date(0, 0, 0, Number(time[0]), Number(time[1])), 'yyyy/MM/dd HH:mm');
        }
        return t;
      });

      console.log(times);
      times = _.cloneDeep(times).map((t) => {
        t.scheduleTime = format(new Date(t.scheduleTime), 'HH:mm');
        return t;
      });

      times = _.unionBy(times, 'scheduleTime');
      formData = {
        ...formData,
        createSummaries: times,
        pauseAll: pauseAllFlag,
        receiveEmails: receiveEmailsFlag,
      };
      await submitNotification({
        variables: formData,
      });
      setSchedules(
        times.map((t) => {
          const time = t.scheduleTime.split(':');
          t.scheduleTime = format(new Date(0, 0, 0, Number(time[0]), Number(time[1])), 'yyyy/MM/dd HH:mm');

          return t;
        })
      );
      toast.success(successList.notificationUpdate);
    } catch (e) {
      console.log(e);
      catchError(e, true);
    }
  };

  function addSchedule() {
    setSchedules(
      schedules.concat({
        schedule: `Schedule ${schedules.length + 1}`,
        scheduleTime: new Date(),
      } as unknown as NotificationSettings_pretaaGetUserNotification_notificationSummary)
    );
  }

  function addScheduleTime(index: number, date: Moment | string) {
    if (typeof date !== 'string') {
      const time = date.toDate();
      const list = _.cloneDeep(schedules);
      list[index] = {
        ...list[index],
        scheduleTime: time as unknown as string,
      };
      setSchedules(list);
    }
  }

  function addScheduleLabel(index: number, schedule: string) {
    if (schedule) {
      const list = _.cloneDeep(schedules);
      list[index] = {
        ...list[index],
        schedule,
      };
      setSchedules(list);
    }
  }

  function removeSchedule(index: number) {
    const list = _.cloneDeep(schedules);
    list.splice(index, 1);
    const updatedList = list.map((item, scheduleIndex) => ({
      ...item,
      schedule: item.schedule.slice(0, -item.schedule?.replace(/[^0-9\.]+/g, '')?.length) + (scheduleIndex + 1),
    }));
    setSchedules(updatedList);
  }

  useEffect(() => {
    if (notificationSettings) {
      setValue('notificationSummaryFlag', notificationSettings.pretaaGetUserNotification.notificationSummaryFlag);
      setValue('favoritedCompaniesFlag', notificationSettings.pretaaGetUserNotification.favoritedCompaniesFlag);
      setReceiveEmailsFlag(notificationSettings.pretaaGetUserNotification.receiveEmails);
      setPauseAllFlag(notificationSettings.pretaaGetUserNotification.pauseAll);
      const notificationSchedules = _.cloneDeep(notificationSettings.pretaaGetUserNotification.notificationSummary).map((schedule) => {
        if (isValid(schedule.scheduleTime)) {
          schedule.scheduleTime = format(new Date(schedule.scheduleTime), 'yyyy/MM/dd HH:mm');
        } else {
          const time = schedule.scheduleTime.split(':');
          schedule.scheduleTime = format(new Date(0, 0, 0, Number(time[0]), Number(time[1])), 'yyyy/MM/dd HH:mm');
        }

        return {
          schedule: schedule.schedule,
          scheduleTime: new Date(schedule.scheduleTime),
        } as unknown as NotificationSettings_pretaaGetUserNotification_notificationSummary;
      });
      setSchedules(notificationSchedules);
    }
  }, [notificationSettings]);
  watch('notificationSummaryFlag');
  watch('favoritedCompaniesFlag');

  useEffect(() => {
    TrackingApi.log({
      pageName: routes.settingsNotifications.name,
    });
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <ContentHeader title="Notifications" breadcrumb={false} disableGoBack={true} />
      <ContentFrame className="h-full">
        <form className="flex flex-col h-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded flex-1">
            <div className="mb-6">
              <div className="rounded-lg border-b border-gray-50 px-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-base w-full font-normal capitalize text-primary">Pause All</h3>
                  <div className="flex justify-end">
                    <ToggleSwitch testId='toggle-label-pause' checked={pauseAllFlag} onChange={(isChecked) => setPauseAllFlag(isChecked)} />
                  </div>
                </div>
              </div>
            </div>
            {!pauseAllFlag && (
              <>
                <div className="mb-6">
                  <div className="bg-white rounded-lg border-b border-gray-50 px-4 py-2.5 last:border-0">
                    <div className="flex items-center gap-4">
                      <h3 className="text-base w-full font-normal capitalize text-primary">Starred Companies</h3>
                      <div className="flex justify-end">
                        <ToggleSwitch
                          checked={getValues('favoritedCompaniesFlag')}
                          onChange={(isChecked) => {
                            setValue('favoritedCompaniesFlag', isChecked);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm italic mt-1 ml-4 text-gray-150">Receive notifications for all the events of your starred companies</p>
                </div>
                <div className="bg-white rounded-lg border-b border-gray-50 px-4 py-2.5 last:border-0">
                  <div className="flex items-center gap-4">
                    <h3 className="text-base w-full capitalize font-normal text-primary">Receive Notification Summary</h3>
                    <div className="flex justify-end">
                      <ToggleSwitch
                        checked={getValues('notificationSummaryFlag')}
                        onChange={(isChecked) => {
                          setValue('notificationSummaryFlag', isChecked);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 mb-6">
                  <h2 className="text-base w-full capitalize mb-2 font-normal text-primary">Summary Notification</h2>
                  {schedules.map((schedule, index) => {
                    return (
                      <div data-test-id="schedule" className="bg-white border-b border-gray-50 border-solid" key={index}>
                        <div className="flex items-center gap-4 px-4 py-2.5">
                          <h3 className="text-sm md:text-base lg:text-base w-full font-normal capitalize">
                            <input
                              type="text border-none"
                              value={schedule.schedule}
                              onChange={(event) => {
                                addScheduleLabel(index, event.target.value);
                              }}
                              disabled
                              className="text-primary bg-unset"
                              style={{ background: 'unset' }}
                            />
                          </h3>
                          <div className="flex justify-end relative">
                            <Datetime
                              value={new Date(schedule.scheduleTime)}
                              timeFormat={true}
                              dateFormat={false}
                              onChange={(moment: Moment | string) => {
                                addScheduleTime(index, moment);
                              }}
                            />
                            <div className='remove-button' data-test-id='remove-buttons'>
                            <BsX
                              className="absolute top-1.5 right-1.5 cursor-pointer"
                              onClick={() => {
                                removeSchedule(index);
                              }}
                            />
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-4 px-4 py-2.5 mt-2">
                    <button data-test-id="addschedule"type="button" className="flex font-base text-pt-blue-300 items-center" onClick={addSchedule}>
                      Add
                      <BsPlus className="ml-2" />
                    </button>
                  </div>
                  <div className="border-b mb-6 mt-8" />
                  <div>
                    <div className="mb-4 text-base font-medium text-black pl-2.5">Other notification types</div>
                    <div className="bg-white rounded-lg border-b border-gray-50 px-4 py-2.5 last:border-0">
                      <div className="flex items-center gap-4">
                        <h3 className="text-base w-full font-normal capitalize text-primary">Emails</h3>
                        <div className="flex justify-end">
                          <ToggleSwitch checked={receiveEmailsFlag} onChange={(isChecked) => setReceiveEmailsFlag(isChecked)} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="pt-4 pb-4">
            <Button text="Save" disabled={loading} loading={loading} />
          </div>
        </form>
      </ContentFrame>
    </div>
  );
}
