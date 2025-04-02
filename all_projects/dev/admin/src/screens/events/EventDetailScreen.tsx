/* eslint-disable react-hooks/exhaustive-deps */
import { ContentFrame } from 'components/content-frame/ContentFrame';
import { ContentHeader } from 'components/ContentHeader';
import { DisclosureIcon } from 'components/icons/DisclosureIcon';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import LaunchIcon from 'components/icons/launch';
import { GetEvent, GetEvent_getEventDetails_userEvents, EventType, UserPermissionNames, CreateNote_pretaaNoteCreate, NoteDetails_pretaaGetNote } from 'generatedTypes';
import { eventApi } from 'lib/api';
import catchError, { getError } from 'lib/catch-error';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import EventCardView from 'screens/events/components/EventCard';
import ReferenceCardView from 'screens/events/components/ReferenceCard';
import CompanyBlock from 'screens/companies/components/CompanyBlock';
import AddFloatingButton, { FloatingButtonItem } from 'components/FloatingButton';
import HappyFace from 'components/icons/HappyFace';
import NoteIcon from 'components/icons/Note';
import { toast } from 'react-toastify';
import usePermission from 'lib/use-permission';
import DateFormat from 'components/DateFormat';
import WhistleIcon from 'assets/icons/icon_whistle.svg';
import { NavigationHeader } from 'components/NavigationHeader';
import Popup from 'reactjs-popup';
import Button from 'components/ui/button/Button';
import queryString from 'query-string';
import RatingsCard from './components/RatingsCard';
import LaunchEmailDetails from './components/LaunchEmailDetails';
import UseCaseCard from './components/UseCaseCard';
import eyeShape from '../../assets/icons/eye-shape.svg';
import _ from 'lodash';
import { successList } from '../../lib/message.json';
import './EventDetailScreen.scoped.scss';
import HustleEmailDetails from './components/HustleEmailDetails';
import NoteCreateModal from 'screens/notes/NoteCreateModal';
import { RootState } from 'lib/store/app-store';
import { useSelector } from 'react-redux';
import { TrackingApi } from 'components/Analytics';

interface EventState {
  loading?: boolean;
  error?: null | string;
}
export default function EventDetailScreen(): JSX.Element {
  const { id } = useParams() as any;
  const timelinePermission = usePermission(UserPermissionNames.TIMELINE);
  const emailPermission = usePermission(UserPermissionNames.LAUNCH);
  const notesPermission = usePermission(UserPermissionNames.NOTES);
  const hustleHintPermission = usePermission(UserPermissionNames.HUSTLE_HINTS);
  const navigate = useNavigate();
  const [modal, setModal] = useState<boolean>(false);
  const [eventState, setEventState] = useState<EventState | null>({
    loading: true,
    error: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [btnDisable, setBtnDisable] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user?.currentUser);
  

  const [eventPage, setEventPage] = useState<GetEvent | null>(null);
  async function getPageData() {
    try {
      const event = await eventApi().getEvent({
        id: id,
        whereUserEvent: {
          userId: {
            equals: user?.id,
          },
        },
        whereHustleHintTemplates: {
          customerId: {
            equals: user?.customerId,
          },
        },
      });
      setEventState({ error: null, loading: false });
      setEventPage(event);
    } catch (e) {
      setEventState({
        error: getError(e),
      });
      setEventPage(null);
      catchError(e, true);
    }
  }

  useEffect(() => {
    getPageData();
    TrackingApi.log({
      pageName: routes.eventDetail.name,
      eventId: String(id)
    });
  }, []);

  const links = [
    {
      title: 'Notes',
      link: routes.eventNotes.build(`${eventPage?.getEventDetails?.id}`, {
        count: eventPage?.getEventDetails?.noteCount as number,
      }),
      count: eventPage?.getEventDetails?.noteCount,
      isShow: eventPage?.getEventDetails?.noteCount ? true : false,
      id: 'notes-link'
    },
    {
      title: 'Launched',
      link: routes.launchedList.build({
        eventId: String(eventPage?.getEventDetails?.id),
        count: String(eventPage?.getEventDetails?.launchCount),
      }),
      count: eventPage?.getEventDetails?.launchCount,
      isShow: eventPage?.getEventDetails?.launchCount ? true : false,
    },
    ...(timelinePermission?.capabilities.VIEW
      ? [
          {
            title: 'Timeline',
            link: routes.companyTimeline.build({
              companyId: eventPage?.getEventDetails?.company?.id,
              count: eventPage?.getEventDetails?.timelineCount,
              timeline: true,
            }),
            count: eventPage?.getEventDetails?.timelineCount,
            isShow: eventPage?.getEventDetails?.timelineCount ? true : false,
            id: 'timeline-link'
          },
        ]
      : []),
  ];

  const LinkViews = () => (
    <>
      {links
        .filter((items) => items.isShow)
        .map((link, i) => {
          return (
            <Link
              data-test-id={link.id || 'link'}
              key={i}
              to={link.link}
              className="flex items-center justify-between px-4 
            py-3 border-b last:border-0 text-primary
            cursor-pointer">
              <div>
                {link.title} {link.count && link.count > 0 ? <span className="text-red-500">({link.count})</span> : ''}
              </div>
              <DisclosureIcon />
            </Link>
          );
        })}
    </>
  );

  async function removeFlag() {
    try {
      await eventApi().toggleFlagEvent({
        id,
        where: {
          userId: {
            equals: user?.id,
          },
        },
      });
      let userEvents = eventPage?.getEventDetails?.userEvents[0];
      userEvents = {
        ...userEvents,
        flaggedAt: 2,
      } as GetEvent_getEventDetails_userEvents;
      setEventPage({
        ...eventPage,
        getEventDetails: {
          ...eventPage?.getEventDetails,
          userEvents: [userEvents],
        },
      } as GetEvent);
    } catch (e) {
      catchError(e, true);
    }
  }

  const handleHideAt = async () => {
    setBtnDisable(true);
    const uv = await eventApi().updateHideAtEvent({
      id,
      where: {
        userId: {
          equals: user?.id,
        },
      },
    });
    if (uv?.length) {
      toast.success(successList.eventUnHide);
      const event = _.cloneDeep(eventPage);
      if (event) {
        event.getEventDetails.userEvents[0].hideAt = false;
        setEventPage(event);
      }
    }
  };

  function handleNoteCreate(data: CreateNote_pretaaNoteCreate | NoteDetails_pretaaGetNote) {
    console.log('new note created', { data });
    const eventData = _.cloneDeep(eventPage);
    if (eventData?.getEventDetails) {
      eventData.getEventDetails.noteCount = eventData.getEventDetails.noteCount as number + 1;
    }
    setEventPage(eventData);
  }

  return (
    <>
      <ContentHeader>
        <div className="flex items-center justify-between flex-col md:flex-row">
          <div className="w-full">
            <NavigationHeader>
              <div className="flex flex-row items-center justify-between">
                <div className="block relative text-primary mb-0 mt-2 cursor-pointer" data-test-id="page-title">Event Details</div>
                {hustleHintPermission?.capabilities?.EXECUTE &&
                eventPage?.getEventDetails.useCase?.useCasePretaa.hustleHintTemplates.length ? (
                  <img
                    onClick={() => setModal(true)}
                    className="inline-block cursor-pointer"
                    src={WhistleIcon}
                    alt=""
                  />
                ) : null}
              </div>
            </NavigationHeader>
            <div className="flex">
              {eventPage &&
                eventApi().isFlagged(
                  eventPage?.getEventDetails?.needsAttention,
                  eventPage?.getEventDetails?.userEvents[0]?.flaggedAt as number
                ) && (
                  <button
                    onClick={() => removeFlag()}
                    className="flex items-center bg-pt-red-800 cursor-pointer pl-2 pr-2 mr-2 rounded-full border border-pt-red-800 p-px">
                    <span className="px-1 text-white uppercase text-xxs">Needs Attention</span>
                    <span className="w-6 p-1 bg-opacity-25">
                      <FiX className="text-white text-xs" />
                    </span>
                  </button>
                )}
            </div>
          </div>
          <div>
            {eventPage?.getEventDetails?.userEvents[0]?.hideAt && (
              <Button style="other" onClick={handleHideAt} classes="float-right outline-none ml-2" size="xs" disabled={btnDisable}>
                <img src={eyeShape} alt="button" style={{ height: 48, width: 48, border: '1.5 solid #202030' }} />
              </Button>
            )}
          </div>
        </div>
      </ContentHeader>
      <ContentFrame classes={['space-y-6 overflow-x-hidden']}>
        {eventState?.error && <ErrorMessage message={eventState.error} />}
        {eventPage?.getEventDetails && eventPage?.getEventDetails?.reference?.deletedOn && (
          <div className="inline-block">
            <span className="text-gray-800 italic text-sm">
              Reference removed as of <DateFormat date={eventPage?.getEventDetails?.reference?.deletedOn} /> by{' '}
              {eventPage?.getEventDetails?.reference?.deletedBy?.name}
            </span>
          </div>
        )}
        <EventCardView
          id={id}
          flaggedAt={eventPage?.getEventDetails?.userEvents[0]?.flaggedAt as number}
          className="cursor-default"
          lineClamp="-"
          wrapperClassName="bg-white border rounded-xl"
        />

        {/* Reference Detail and Company Block */}
        {eventPage?.getEventDetails.type === EventType.POTENTIAL_REFERENCE && (
          <ReferenceCardView id={String(eventPage.getEventDetails.referenceId)} />
        )}
        {eventPage?.getEventDetails.company?.id &&
          eventPage?.getEventDetails.useCase?.useCasePretaa.name === 'ratings' &&
          eventPage?.getEventDetails.ratingId && <RatingsCard ratingId={eventPage?.getEventDetails.ratingId} />}

        {/* Info */}
        {eventPage?.getEventDetails.useCase?.useCasePretaa && (
          <UseCaseCard
            name={eventPage?.getEventDetails.useCase.useCasePretaa.name}
            data={eventPage?.getEventDetails.data}
          />
        )}

        {/* Launch Email Detail Block */}
        {eventPage?.getEventDetails?.launchId && <LaunchEmailDetails id={eventPage?.getEventDetails?.launchId} />}
        {eventPage?.getEventDetails?.hustleId && <HustleEmailDetails id={eventPage?.getEventDetails?.hustleId} />}
        {/* Reference Removed Company Block */}
        {eventPage?.getEventDetails?.company &&
          eventPage.getEventDetails.type === EventType.POTENTIAL_REFERENCE &&
          !eventPage.getEventDetails.referenceId && (
            <CompanyBlock id={eventPage.getEventDetails.company.id} type="event" />
          )}

        {/* Event Company Block */}
        {eventPage?.getEventDetails?.company && eventPage.getEventDetails.type !== EventType.POTENTIAL_REFERENCE && (
          <CompanyBlock id={eventPage.getEventDetails.company.id} type="event" />
        )}

        <div>
          <div style={{ height: 'min-content' }} className="bg-white border border-gray-200 rounded-xl">
            <LinkViews />
          </div>
        </div>
      </ContentFrame>

      <AddFloatingButton>
        {emailPermission?.capabilities.EXECUTE &&
          !eventPage?.getEventDetails?.launchId &&
          eventPage?.getEventDetails.company && (
            <FloatingButtonItem id='launch'>
              <Link
                to={`${routes.selectEventTemplate.build({
                  eventId: id,
                  companyId: String(eventPage?.getEventDetails.company?.id),
                  defaultTemplateId: eventPage?.getEventDetails.defaultTemplateId as string,
                })}`}
                className="flex items-center">
                <LaunchIcon className="mr-2 text-primary-light" /> Launch
              </Link>
            </FloatingButtonItem>
          )}

        {eventPage?.getEventDetails.company && (
          <FloatingButtonItem id='company-rating'>
            <Link
              to={routes.companyRating.build({
                companyId: String(eventPage?.getEventDetails.company?.id),
                eventId: id,
              })}
              className="flex items-center">
              <HappyFace className="mr-4 text-primary-light" />
              Company Rating
            </Link>
          </FloatingButtonItem>
        )}

        {notesPermission?.capabilities?.CREATE && (
          <FloatingButtonItem id="note-create">
            <span onClick={() => setIsOpen(true)} className="flex items-center focus:outline-none">
              <NoteIcon className="mr-4 text-primary-light" />
              Note
            </span>
          </FloatingButtonItem>
        )}
      </AddFloatingButton>

      <Popup
        modal={true}
        open={modal}
        onClose={() => {
          setModal(false);
        }}
        position="center center"
        contentStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          width: 348,
          borderRadius: 16,
          padding: '5px 0',
        }}>
        <div className="flex flex-col items-center justify-between ">
          <div className="p-10 flex flex-col items-center justify-center border-b border-border-dark w-full">
            <h3 className="heading text-gray-150">Hustle Hint</h3>
            <p className="sub-text text-gray-150 text-center">
              {eventPage?.getEventDetails.useCase?.useCasePretaa.hustleHintTemplates[0]?.hustleHintLanguage}
            </p>
          </div>
          <div className="flex flex-row items-center justify-center pt-2">
            <Button
              classes="sm:ml-2 outline-none lg:px-6 text-pt-secondary"
              text="Send email"
              style="bg-none"
              onClick={() =>
                navigate(
                  routes.launchEmail.build({
                    selectedTemplate: queryString.stringify({
                      label: eventPage?.getEventDetails.useCase?.useCasePretaa.hustleHintTemplates?.[0]?.templateName,
                      value: eventPage?.getEventDetails.useCase?.useCasePretaa.hustleHintTemplates?.[0]?.id,
                    }),
                    isHustleHint: true,
                    eventId: eventPage?.getEventDetails.id,
                    companyId: eventPage?.getEventDetails.company?.id,
                  })
                )
              }
            />
            <Button
              classes="sm:ml-2"
              text="Cancel"
              style="bg-none"
              onClick={() => {
                setModal(false);
              }}
            />
          </div>
        </div>
      </Popup>

      {isOpen && <NoteCreateModal open={isOpen} setOpen={setIsOpen} eventId={id} onSubmitted={handleNoteCreate} />}
    </>
  );
}
