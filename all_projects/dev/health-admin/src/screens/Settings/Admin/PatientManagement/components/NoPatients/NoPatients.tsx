import React from 'react';
import UserPlus from '../../../../../../../src/assets/images/user-plus.svg';
import './NoPatients.scss';

export default function NoPatients() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full notes-not-found">
        <div className="flex flex-col justify-center items-center">
          <img src={UserPlus} alt="User Plus" />
          <h3 className="font-bold mt-2 text-center">No patients to manage yet</h3>
          <p className='text-base text-center'>Please connect/import your EHR <br/>records through the admin client.</p>
        </div>
      </div>
    </>
  );
}
