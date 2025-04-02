import React from 'react';
import CloseIcon from 'components/icons/CloseIcon';
import Star from 'components/icons/Star';

export default function FeedbackModal({ onClose, noOfStar }: { onClose: () => void; noOfStar: any }) {
  const starDifference = 5 - noOfStar;
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0  bg-overlay z-20 flex items-center justify-center" onClick={() => onClose()}>
      <div className="w-11/12 md:w-auto flex flex-col justify-center items-center bg-white p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-full flex justify-end p-2">
          <span onClick={() => onClose()} className="cursor-pointer" data-testid='cross-button'>
            <CloseIcon className="w-4 h-4" />
          </span>
        </div>
        <div className="flex flex-row mt-14">
          {Array.from({ length: noOfStar }, (e, i) => (
            <Star key={i} className="text-yellow-900 w-16 h-16 md:w-20 md:h-20 p-2" />
          ))}
          {Array.from({ length: starDifference }, (e, i) => (
            <Star key={i} className="text-gray-400 w-16 h-16 md:w-20 md:h-20 p-2" />
          ))}
        </div>
        <div className="text-lmd font-bold mt-12">Thank you!</div>
        <p className="font-medium modal-content text-center mt-3">By making your voice heard, you help</p>
        <p className="font-medium modal-content text-center">us improve Pretaa.</p>
      </div>
    </div>
  );
}
