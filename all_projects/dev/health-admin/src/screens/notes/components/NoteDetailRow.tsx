import PatientNameCard from 'components/PatientNameCard';
import React, { ReactNode } from 'react';
import EventCardView from 'screens/EventsScreen/component/EventCard';

interface NoteDetailsListInterface {
  title: string;
  content: string | JSX.Element;
  createdBy: ReactNode;
  updatedAt?: any;
  eventId: string | null;
  patientId: string | null;
}
export default function NoteDetailRow({ title, content, createdBy, updatedAt, eventId, patientId }: NoteDetailsListInterface) {
  return (
    <>
      {eventId && <EventCardView eventId={eventId} />}
      {(!eventId && patientId) && <PatientNameCard patientId={patientId} />}

      <div className="p-3 sm:p-6 mt-4 ">
        <div className="text-md font-bold text-gray-800 " data-testid="note-headline">{title}</div>
        <div className="mt-6 text-base font-light" data-testid="note-details">{content}</div>
        <hr className="w-full h-0.5 bg-gray-350 mt-8" />
        <div className="mt-4 text-xs italic text-gray-400">{createdBy}</div>
        {updatedAt && (
          <>
            <hr className="w-full h-0.5 bg-gray-350 mt-8" />
            <div className="mt-4 text-xs italic text-gray-400">{updatedAt}</div>
          </>
        )}
      </div>
    </>
  );
}
