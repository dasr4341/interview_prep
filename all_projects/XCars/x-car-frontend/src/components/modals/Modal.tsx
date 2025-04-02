import { RiCloseFill } from 'react-icons/ri';
import Button from '../buttons/Button';
import { IModal } from './modal.interface';
import { FC } from 'react';

const Modal: FC<IModal> = ({ onClose, children, heading }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className=" bg-white rounded-lg shadow-lg w-full max-w-md p-4">
        {onClose && (
          <div className=" flex justify-end">
            <Button onClick={onClose} className=" p-0 ">
              <div className=" bg-gray-200 p-2 rounded-full">
                <RiCloseFill size={'20px'} color="gray" />
              </div>
            </Button>
          </div>
        )}
        {heading && (
          <div className=" text-lg font-semibold px-8 capitalize">
            {heading}
          </div>
        )}
        <div className=" my-8">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
