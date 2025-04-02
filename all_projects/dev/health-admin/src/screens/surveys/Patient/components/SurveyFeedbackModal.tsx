import React from 'react';

import CloseIcon from 'components/icons/CloseIcon';
import Button from 'components/ui/button/Button';

export default function SurveyFeedbackModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0  bg-overlay z-20 flex items-center justify-center">
      <div
        className="w-11/12 sm:w-96 flex flex-col justify-center items-center bg-white p-8 rounded-xl">
        <div className="w-full flex justify-end">
          <span onClick={() => onClose()} className="cursor-pointer">
            <CloseIcon className="w-4 h-4" />
          </span>
        </div>
        <div className="text-lmd font-bold mb-6 mt-4">Assessment Completed</div>
        <div className="font-medium text-sm text-black text-center">
          If you're feeling in distress or suicidal, remember help is just a call away. Dial 988 for
          the Suicide & Crisis Lifeline. It provides 24/7, free, and confidential support. Don't hesitate
          to reach out, you're not alone and there are professionals ready to help.</div>
        <Button className="w-full mt-10" onClick={() => onClose()}>Dismiss</Button>
      </div>
    </div>
  );
}
