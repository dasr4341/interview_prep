import React from 'react';
import Button from './ui/button/Button';
import Popup from 'reactjs-popup';
import '../screens/events/EventDetailScreen.scoped.scss';

export function TimeOutModal({ visible, onSubmit }: { visible: boolean; onSubmit: () => void }): JSX.Element {
  return (
    <Popup
      open={visible}
      position="center center"
      contentStyle={{
        maxHeight: '80vh',
        overflowY: 'auto',
        width: 348,
        borderRadius: 16,
        padding: '5px 0',
      }}>
      <div className="flex flex-col items-center justify-between">
        <div className="p-10 flex flex-col items-center justify-center border-b border-border-dark">
          <h3 className="heading text-gray-150">Session Expired</h3>
          <p className="sub-text text-gray-150 text-center">You were inactive for 1 hour. Please login again</p>
        </div>
        <div className="flex flex-row items-center justify-center pt-2">
          <Button
            classes="sm:ml-2 outline-none lg:px-6 text-pt-secondary"
            text="Okay"
            style="bg-none"
            onClick={onSubmit}
          />
        </div>
      </div>
    </Popup>
  );
}
