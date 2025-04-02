
import ConfirmationDialog from 'components/ConfirmationDialog';
import Popover, { PopOverItem } from 'components/Popover';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function ManagementRow({ 
  title, count, link, editLink, onDelete } : 
  { title: string, count: number, link: string, editLink: string,
     onDelete: () => void }) {
    const [confirm, setConfirm] = useState<boolean>(false);
    const navigate = useNavigate();
  return (
    <>
    <div className="border-b border-gray-300 bg-white py-4 px-4
      flex justify-between items-center 
      cursor-pointer"
      onClick={() => navigate(link)}>
      <div className="">
        <h3 className="text-base text-primary font-bold">
          {title}
        </h3>
        <p className="uppercase text-xs text-gray-600 font-semibold">
          {count} Companies
        </p>
      </div>
      <Popover>
        <PopOverItem>
          <Link to={editLink}>
            Edit
          </Link>
        </PopOverItem>
        <PopOverItem onClick={() => setConfirm(true)}>
          <button className="uppercase font-semibold">Delete</button>
        </PopOverItem>
      </Popover>
    </div>

    <ConfirmationDialog
      modalState={confirm}
      onConfirm={onDelete}
      onCancel={() => setConfirm(false)}>
      Are you sure you want to permanently delete this company? 
        Deleted company cannot be recovered.
    </ConfirmationDialog>
    </>
  );
}
