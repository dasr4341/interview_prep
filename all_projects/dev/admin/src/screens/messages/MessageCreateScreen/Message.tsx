import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from 'routes';
import SafeHtml from 'components/SafeHtml';
import DateFormat from 'components/DateFormat';

export default function Message({ note }: { note: any }): JSX.Element {
  const [noteObj, setNoteObj] = useState<any>(note);
  const [isNoteRead, setIsNoteRead] = useState<boolean>(false);

  useEffect(() => {
    setNoteObj(note);
    if (note && note.userMessages.length > 0 && note.userMessages[0].readAt) {
      setIsNoteRead(true);
    } else {
      setIsNoteRead(false);
    }
  }, [note]);

  return (
    <>
      <div
        className={`${isNoteRead ? '' : 'bg-white'}
       border-not-last-child flex gap-4 items-center px-5 py-7`}
        data-test-id="notes">
        <div className="flex-1 break-all">
          <Link to={routes.message.build(noteObj.id, { eventId: noteObj.eventId })} key={noteObj.id}>
            <h3 className={`capitalize text-base text-primary mb-1 ${isNoteRead ? '' : 'font-bold'}`}>
              {noteObj.subject}
            </h3>
            <SafeHtml rawHtml={noteObj.text} className="text-gray-600 line-clamp-2" />
          </Link>
        </div>
        <span className="text-sm text-gray-600">
          <DateFormat date={noteObj.createdAt} />
        </span>
      </div>
    </>
  );
}
