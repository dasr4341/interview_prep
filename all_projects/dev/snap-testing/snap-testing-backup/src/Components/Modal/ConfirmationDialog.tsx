import React from 'react';
import { ImSpinner7 } from 'react-icons/im';
import Popup from 'reactjs-popup';
import './confirmationDialog.css';

export default function ConfirmationDialog({
  title,
  state,
  onClose,
  archive,
  loading,
}: {
  title: string;
  state: boolean;
  onClose: () => void;
  archive: () => any;
  loading: boolean;
}) {
  return (
    <Popup open={state} modal nested>
      <div className=' w-11/12 sm:w-full  mx-auto bg-slate-100  py-8 px-12 rounded-xl '>
        <div className='md:text-2xl text-xl  font-medium text-center mt-4'>{title}</div>
        <div className='flex mt-11 justify-center items-center mb-4'>
          <button
            className='bg-white border md:text-sm text-xs font-medium px-6 py-2  rounded'
            onClick={() => onClose()}>
            Cancel
          </button>
          <button
            disabled={loading}
            className={`bg-theme-color items-center border md:text-sm flex text-xs font-medium px-8 py-2  rounded text-white ml-4 ${
              loading ? 'cursor-wait' : 'cursor-pointer'
            }`}
            onClick={() => {
              archive();
            }}>
            Yes
            {loading && <ImSpinner7 className='animate-spin ml-2' />}
          </button>
        </div>
      </div>
    </Popup>
  );
}
