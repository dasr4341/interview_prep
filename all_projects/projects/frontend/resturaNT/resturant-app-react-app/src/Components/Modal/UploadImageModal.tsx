import React from 'react';
import ButtonComponent from '../Button/ButtonComponent';

export default function UploadImageModal({ modalView, setModalFalse }: { modalView: boolean; setModalFalse: any }) {
  return (
    <>
      <div
        id='UploadImageModal'
        className={` ${
          modalView ? '' : 'hidden'
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full h-full justify-center items-center flex`}
        tabIndex={-1}
        role='dialog'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
        }}>
        <div className='relative p-4 w-full max-w-md h-full md:h-auto'>
          <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
            <button
              type='button'
              className='absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white'
              onClick={() => setModalFalse()}>
              <svg
                aria-hidden='true'
                className='w-5 h-5'
                fill='currentColor'
                viewBox='0 0 20 20'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'></path>
              </svg>
              <span className='sr-only'>Close modal</span>
            </button>
            <div className='py-6 px-4 lg:px-8'>
              <h3 className='mb-4 text-xl font-medium text-gray-900 dark:text-white'>Upload your Image</h3>
              <form className='space-y-6'>
                <div>
                  <input type='file' name='' id='' className='bg-cyan-100 w-full rounded-md' />
                </div>
                <ButtonComponent type='submit' color='black'>
                  Upload
                </ButtonComponent>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
