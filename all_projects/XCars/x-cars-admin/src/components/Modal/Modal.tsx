import { IModal } from './modal.interface';
import { Loader } from '../Icons/Loader';
import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IoMdClose } from 'react-icons/io';
import { BsQuestionCircle } from 'react-icons/bs';

const ConfirmationModal: React.FC<IModal> = ({
  title,
  onClose,
  onConfirm,
  open,
  loading,
}) => {
  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="overflow-hidden fixed bg-overlay top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm">
        <Typography
          id="modal-modal-description"
          className=" flex flex-col bg-white  rounded-md w-[95%] sm:w-[80%] md:w-[50%] xl:w-[30%] mx-auto absolute transform p-6 py-10 left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2 "
        >
          <button className=" self-end" onClick={() => onClose()}>
            <IoMdClose
              size={30}
              className=" text-gray-400 p-1 bg-gray-200 rounded-full"
            />
          </button>
          <div className="flex justify-center mb-6">
            <BsQuestionCircle className="text-red-500 text-8xl" />
          </div>
          <span className=" font-semibold text-gray-800 text-xl text-center px-4">
            {title}
          </span>
          <div className=" flex justify-center w-full gap-3 items-center mt-12">
            <button
              type="button"
              className="  font-semibold  hover:bg-red-600  text-gray-800 text-md py-2 px-4 border w-full text-center border-red-600  rounded-md hover:text-white capitalize"
              onClick={onClose}
              disabled={loading}
            >
              No
            </button>
            <button
              className=" font-semibold bg-blue-500  text-white text-md py-2 px-4 border w-full text-center border-blue-500  rounded-md hover:bg-blue-600 capitalize"
              type="button"
              onClick={onConfirm}
              autoFocus
              disabled={loading}
            >
              Yes {loading && <Loader className=" w-2 h-2 text-green-700" />}
            </button>
          </div>
        </Typography>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
