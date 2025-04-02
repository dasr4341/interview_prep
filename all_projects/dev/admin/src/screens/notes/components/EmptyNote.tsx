import { useState } from 'react';
import emptyImg from 'assets/images/empty_note.svg';
import NoteCreateModal from '../NoteCreateModal';

export default function EmptyNote() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col flex-1 items-center justify-center max-w-sm m-auto">
      <img src={emptyImg} alt="note icon" />
      <h1 className="h1 leading-tight mb-3 text-center text-primary">No notes yet</h1>
      {isOpen && <NoteCreateModal open={isOpen} setOpen={setIsOpen} />}
    </div>
  );
}
