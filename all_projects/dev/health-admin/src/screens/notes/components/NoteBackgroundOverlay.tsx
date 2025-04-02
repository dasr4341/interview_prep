import React, { ReactNode } from 'react';
import './_notes-list.scoped.scss';

export default function NoteBackgroundOverlay({ children, onClick }: { children?: ReactNode; onClick:()=>void }) {
  return (
    <div onClick={() => onClick()} className="fixed modal-overlay top-0 left-0 right-0 bottom-0 bg-overlay flex items-center justify-center">
      {children}
    </div>
  );
}
