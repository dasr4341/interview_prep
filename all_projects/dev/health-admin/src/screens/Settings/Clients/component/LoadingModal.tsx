import React from 'react';
import Popup from 'reactjs-popup';
import CloseIcon from 'components/icons/CloseIcon';
import PretaaLoadingLogo from '../../../../components/ui/PretaaLoadingLogo/PretaaLoadingLogo';

export default function LoadingModal({ modalState, onClose }: { modalState?: boolean; onClose:()=> void }) {
  return (
    <>
      <Popup className=" popup-w-auto rounded-xl min-w-300" open={modalState} closeOnDocumentClick onClose={() => onClose()} modal>
        <div className="flex flex-col items-center p-4">
          <div className="flex justify-end w-full">
            <button type="button" onClick={() => onClose()}>
              <CloseIcon className="w-3 h-3" />
            </button>
          </div>
          <PretaaLoadingLogo />
          <div className="font-bold text-xmd mt-4">Your report is processing ...</div>
          <div className="text-sm tracking-wide font-light mt-3">Your report will automatically download once ready</div>
        </div>
      </Popup>
    </>
  );
}
