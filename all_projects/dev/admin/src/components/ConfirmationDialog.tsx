import React, { ReactNode, useEffect, useState } from 'react';
import Popup from 'reactjs-popup';
import Button from './ui/button/Button';

export default function ConfirmationDialog({
  children,
  onConfirm,
  modalState,
  onCancel,
  confirmBtnText,
  className,
  buttonRowAlign,
  disabledBtn,
  hideBtns,
  changeBtnStyle,
  contentWrapperClass,
}: {
  children: ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
  modalState?: boolean;
  confirmBtnText?: string;
  className?: string;
  buttonRowAlign?: string;
  disabledBtn?: boolean;
  hideBtns?: boolean;
  changeBtnStyle?: boolean;
  contentWrapperClass?: string;
}) {

  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    setDialogOpen(modalState as boolean);
  }, [modalState]);

  function handleOnClose() {
    setDialogOpen(false);
    if (onCancel) {
      onCancel();
    }
  }

  return (
    <div>
      <Popup
        className={`popup-w-auto ${className}`}
        open={dialogOpen}
        closeOnDocumentClick
        onClose={() => handleOnClose()}
        modal>
        <div className="modal text-center">
          <div className={`text-gray-150 ${contentWrapperClass ? contentWrapperClass : 'pt-5 px-5'}`} data-test-id="popup-content">
            {children}
          </div>

          <div className={`mt-10 p-5 flex flex-col sm:flex-row 
          ${buttonRowAlign ? buttonRowAlign : 'justify-between'}
          ${hideBtns ? 'hidden' : ''}`}>
            <Button text={confirmBtnText ? confirmBtnText : 'Delete'}
            classes={`${changeBtnStyle ? 'text-pt-red-800' : ''}`}
            style={`${changeBtnStyle ? 'other' : 'primary'}`} disabled={disabledBtn}
             onClick={() => onConfirm && onConfirm()}
             testId="confirm-btn" />

            <Button
              classes="sm:ml-2"
              text="Cancel"
              style="bg-none"
              onClick={() => handleOnClose()}
            />
          </div>
        </div>
      </Popup>
    </div>
  );
}
