import React, { useState } from 'react';
import './_event-status.scoped.scss';
import {
  PretaaHealthEventSearch_pretaaHealthEventSearch,
  ReportingEventSearch_pretaaHealthReportingEventSearch,
  UserPermissionNames,
} from 'health-generatedTypes';
import CreateNoteModal from 'screens/notes/components/modal/CreateNoteModal';
import { useAppSelector } from 'lib/store/app-store';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { Menu } from '@mantine/core';
import ThreeDotIcon from 'components/icons/ThreeDotIcon';

interface CreateNoteStateInterface {
  showPopUp?: boolean;
  showModal?: boolean;
}

export default function EventRowPopOver({
  loading,
  toggleReadUnread,
  setEventReminder,
  event,
  showReminder,
}: {
  loading: boolean;
  toggleReadUnread: (id: string) => void;
  setEventReminder: (id: string, reminderType: string) => void;
  event: PretaaHealthEventSearch_pretaaHealthEventSearch | ReportingEventSearch_pretaaHealthReportingEventSearch;
  showReminder?: boolean;
}) {
  const [createNoteState, setCreateNoteState] =
    useState<CreateNoteStateInterface>({ showPopUp: false });
  const reminderTypes = useAppSelector(
    (state) => state.app.appData?.pretaaHealthReminderTypes
  );
  const [optionsVisible, setOptionsVisible] = useState(false);
  const noteCreatePrivilege = useGetPrivilege(
    UserPermissionNames.NOTES,
    CapabilitiesType.CREATE
  );

  return (
    <div>
      {createNoteState?.showModal && event.id && (
        <CreateNoteModal
          eventId={event.id}
          modalTitle="New Note"
          onClick={() => setCreateNoteState({ showModal: false })}
        />
      )}

      <Menu
        position="bottom-end"
        withArrow
        opened={optionsVisible}
        width={200}
        onChange={() => setOptionsVisible(!optionsVisible)}>
        <Menu.Target>
          <button>
            <ThreeDotIcon
              className="w-4 h-1 m-2 cursor-pointer text-gray-600 hover:text-gray-600"
              data-test-id="pop-over-trigger-el"
            />
          </button>
        </Menu.Target>
        <Menu.Dropdown>
          <div
            className={`p-2  ${loading ? 'cursor-wait' : 'cursor-pointer'}`}
            onClick={() => {
              setOptionsVisible(false);
            }}>
            <ul className="list-none uppercase text-xs pb-4 last:pb-0 pop-over-list">
              {noteCreatePrivilege ? (
                <li
                  onClick={() =>
                    setCreateNoteState({ ...createNoteState, showModal: true })
                  }
                  data-testid="note-popover-element">
                  Note
                </li>
              ) : (
                ''
              )}
              <li
                onClick={() => !loading && toggleReadUnread(String(event.id))}
                className="hover-event-action"
                data-testid="read-unread-popover">
                {event?.userevent?.readAt ? 'mark as unread' : 'mark as read'}
              </li>
              {showReminder && (
                <li>
                  SNOOZE for:
                  <ul className="snooze-timing-list">
                    {reminderTypes &&
                      Object.keys(reminderTypes).map((e) => (
                        <li
                          key={e}
                          className="hover-event-action"
                          data-testid="snoozeOption"
                          onClick={() =>
                            !loading && setEventReminder(String(event.id), e)
                          }>
                          {reminderTypes[e]}
                        </li>
                      ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
