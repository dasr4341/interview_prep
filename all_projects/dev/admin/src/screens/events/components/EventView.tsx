/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {
  EventCard_getEventDetails,
  GetEvents_getFilteredEvents,
  GetEvents_getFilteredEvents_userEvents,
  UserPermissionNames,
} from '../../../generatedTypes';
import { routes } from '../../../routes';
import { eventApi } from 'lib/api/event';
import { toast } from 'react-toastify';
import DateFormat from 'components/DateFormat';
import Popover, { PopOverItem } from 'components/Popover';
import SafeHtml from 'components/SafeHtml';
import './_event.scoped.scss';
import useQueryParams from 'lib/use-queryparams';
import { FaChevronRight } from 'react-icons/fa';
import NoteCreateModal from 'screens/notes/NoteCreateModal';
import usePermission from 'lib/use-permission';
import { useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';

export default function EventView({
  event,
  options,
  onChange,
  className,
  viewType,
  lineClamp,
  wrapperClassName,
  isReference
}: {
  event: EventCard_getEventDetails;
  options?: 'hide';
  onChange?: (id: string) => void;
  className?: string;
  viewType?: 'timeline' | 'list';
  lineClamp?: string;
  wrapperClassName?: string;
  isReference?: boolean;
}): JSX.Element {
  const query = useQueryParams();
  const [eventObj, setEventObj] = useState<GetEvents_getFilteredEvents>(event);
  const [userEvent, setUserEvent] = useState<GetEvents_getFilteredEvents_userEvents>();
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);


  const eventPermission = usePermission(UserPermissionNames.EVENTS);
  const timelinePermission = usePermission(UserPermissionNames.TIMELINE);
  const notesPermission = usePermission(UserPermissionNames.NOTES);
  
  async function toggleHide() {
    const uv = await eventApi().updateHideAtEvent({
      id: event.id,
      where: {
        userId: {
          equals: user?.id,
        },
      },
    });
    if (uv?.length) {
      toast.success(`${isReference ? 'Reference' : 'Event'} successfully ${uv[0].hideAt ? 'hidden' : 'unhide'}`);
    }

    if (onChange) onChange(event.id);
  }

  async function toggleReadAt() {
    const uv = await eventApi().updateReadAtEvent({
      id: event.id,
      where: {
        userId: {
          equals: user?.id,
        },
      },
    });
    if (uv) {
      toast.success(
        `${isReference ? 'Reference' : 'Event'} successfully marked as ${uv[0].readAt ? 'read' : 'unread'}`
      );
      setUserEvent(uv[0]);
    }
  }

  useEffect(() => {
    setEventObj(event);
    setUserEvent(event.userEvents[0]);
  }, [event]);

  return (
    <div
      key={eventObj.id}
      className={classNames(
        `block py-6 px-5 border-b border-gray-100 relative ${wrapperClassName ? wrapperClassName : ''}`,
        {
          'bg-white font-bold': !userEvent || (userEvent && !userEvent?.readAt),
        },
        {
          'bg-flagged': eventApi().isFlagged(eventObj.needsAttention, userEvent?.flaggedAt as number),
        }
      )}
      data-test-event-status={userEvent?.readAt ? 'read' : 'unread'}
      data-test-id="events" data-event-type={eventObj.type}
      data-link-id={eventObj.id}>
      {/* Underline required because of this class added from database  */}
      <span className="underline"></span>
      <span className="no-underline"></span>

      <div className="flex items-center space-x-4">
        <Link
          to={
            viewType === 'timeline'
              ? routes.companyEventDetail.build({
                  eventId: eventObj.id,
                  companyId: query?.companyId,
                })
              : routes.eventDetail.build(String(eventObj.id))
          }
          className={`flex-1 ${className ? className : ''}`}>
          <h3
            className="font-medium text-xs text-primary opacity-50 mb-1 
            uppercase">
            {eventObj.type.replaceAll('_', ' ')}
          </h3>
          <div
            className={`text-primary opacity-75 ${lineClamp ? lineClamp : 'line-clamp-2'}`}
            data-test-id="events_desc">
            <SafeHtml rawHtml={eventObj?.text as string} className={`mt-0 ${className ? className : ''}`} />
          </div>
        </Link>
        <span className="text-sm text-gray opacity-50" data-test-id="event-created-at">
          <DateFormat date={eventObj.createdAt} />
        </span>

        {options !== 'hide' &&
          (viewType === 'timeline' ? timelinePermission?.capabilities?.EDIT : eventPermission?.capabilities?.EDIT) && (
            <>
              <div className="w-px bg-gray-400 h-4" />
              {isReference && (
                <Link to={routes.eventDetail.build(String(eventObj.id))} className="md:float-right p-1">
                  <FaChevronRight className="text-base text-gray-400" />
                </Link>
              )}
              {!isReference && (
                <Popover>
                  {notesPermission?.capabilities?.CREATE && (
                    <PopOverItem onClick={() => setIsOpen(true)}>Note</PopOverItem>
                  )}
                  <PopOverItem onClick={() => toggleReadAt()} id="read-unread-option">
                    MARK AS {userEvent?.readAt ? 'Unread' : 'read'}
                  </PopOverItem>
                  {viewType !== 'timeline' && (
                    <PopOverItem id="hide-show-option" onClick={() => toggleHide()}>{userEvent?.hideAt ? 'Unhide' : 'Hide'}</PopOverItem>
                  )}
                </Popover>
              )}
            </>
          )}
        {isOpen && <NoteCreateModal open={isOpen} setOpen={setIsOpen} eventId={eventObj?.id} />}
      </div>
    </div>
  );
}
