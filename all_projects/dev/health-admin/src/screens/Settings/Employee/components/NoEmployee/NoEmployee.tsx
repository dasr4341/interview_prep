import Button from 'components/ui/button/Button';
import React from 'react';
import UserPlus from '../../../../../../src/assets/images/user-plus.svg';
import './NoEmployee.scss';

export default function NoEmployee() {
  return (
    <>
      <div className="flex flex-col justify-center items-center h-full notes-not-found">
        <div className="flex flex-col justify-center items-center">
          <img src={UserPlus} alt="User Plus" />
          <h3 className="font-bold mt-2 text-center">No counselors to manage yet</h3>
          <p className='text-base text-center'>Please continue to upload your company’s data</p>
          <Button className='whitespace-nowrap'>Add</Button>
        </div>
      </div>
    </>
  );
}
