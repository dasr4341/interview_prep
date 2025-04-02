import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IoMdClose } from 'react-icons/io';
import { Loader } from '@mantine/core';
import { FormControl } from '@mui/material';
import { ErrorMessage } from '@/components/ErrorMessage';
import { FieldValues, useForm } from 'react-hook-form';
import { message } from '@/config/message';

export interface IModal {
  onClose: () => void;
  // eslint-disable-next-line no-unused-vars
  onConfirm: (
    // eslint-disable-next-line no-unused-vars
    bundleName: string,
    // eslint-disable-next-line no-unused-vars
    bundlePrice: number,
    // eslint-disable-next-line no-unused-vars
    discountedAmount: number | null
  ) => void;
  title?: string;
  open: boolean;
  loading?: boolean;
  onBlur?: () => void;
}

const BundleConfirmationModel: React.FC<IModal> = ({
  title,
  onClose,
  onConfirm,
  open,
  loading,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm();

  const confirmFormSubmit = (data: FieldValues) => {
    if (!data.bundleName.trim().length) {
      setError('bundleName', {
        type: 'custom',
        message: message.required('bundle name'),
      });
    } else if (!data.bundlePrice.trim().length) {
      setError('bundlePrice', {
        type: 'custom',
        message: message.required('bundle price'),
      });
    } else if (!Number(data.bundlePrice)) {
      setError('bundlePrice', {
        type: 'custom',
        message: message.zeroValue('Bundle Price'),
      });
    } else if (
      data.discountedAmount.trim().length &&
      !Number(data.discountedAmount)
    ) {
      setError('discountedAmount', {
        type: 'custom',
        message: message.zeroValue('Discounted amount'),
      });
    } else {
      onConfirm(
        data.bundleName,
        Number(data.bundlePrice),
        data.discountedAmount ? Number(data.discountedAmount) : null
      );
      resetForm();
    }
  };

  const resetForm = () => {
    reset({
      bundleName: '',
      bundlePrice: '',
      discountedAmount: '',
    });
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        resetForm();
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="overflow-hidden fixed bg-overlay top-0 left-0 right-0 bottom-0 z-50 backdrop-blur-sm">
        <Typography
          id="modal-modal-description"
          className=" flex flex-col bg-white  rounded-md w-[95%] sm:w-[80%] md:w-[50%] xl:w-[30%] mx-auto absolute transform p-6 py-6 left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2 "
        >
          <button
            className=" self-end"
            onClick={() => {
              onClose();
              resetForm();
            }}
          >
            <IoMdClose
              size={25}
              className=" text-gray-400 p-1 bg-gray-200 rounded-full"
            />
          </button>
          <span className=" font-semibold text-gray-800 text-lg text-center px-4">
            {title}
          </span>

          <form
            onSubmit={handleSubmit((data) => {
              confirmFormSubmit(data);
            })}
            className="flex flex-col gap-4 mt-8 mb-4 item-center"
          >
            <FormControl className="select">
              <label
                htmlFor="select"
                className=" font-medium text-gray-600 text-md   mb-2"
              >
                Bundle Name
              </label>
              <input
                {...register('bundleName')}
                disabled={loading}
                className="border border-blue-100 p-4 capitalize rounded-md"
                placeholder="Please enter bundle name"
              />
            </FormControl>
            {errors.bundleName && (
              <ErrorMessage message={String(errors.bundleName.message)} />
            )}

            <FormControl className="select">
              <label
                htmlFor="select"
                className=" font-medium text-gray-600 text-md   mb-2"
              >
                Bundle Prices
              </label>
              <input
                {...register('bundlePrice')}
                disabled={loading}
                className="border border-blue-100 p-4 capitalize rounded-md"
                type="number"
                placeholder="Please enter bundle price"
              />
            </FormControl>
            {errors.bundlePrice && (
              <ErrorMessage message={String(errors.bundlePrice.message)} />
            )}

            <FormControl className="select">
              <label
                htmlFor="select"
                className=" font-medium text-gray-600 text-md mb-2"
              >
                Discounted Amount
              </label>
              <input
                {...register('discountedAmount')}
                disabled={loading}
                className="border border-blue-100 p-4 capitalize rounded-md"
                type="number"
                placeholder="Please enter discounted bundle price"
              />
            </FormControl>
            {errors.discountedAmount && (
              <ErrorMessage message={String(errors.discountedAmount.message)} />
            )}

            <div className=" flex justify-center w-full gap-3 items-center mt-12">
              <button
                type="button"
                className="  font-semibold  hover:bg-red-600  text-gray-800 text-md py-2 px-4 border w-full text-center border-red-600  rounded-md hover:text-white capitalize"
                onClick={() => {
                  onClose();
                  resetForm();
                }}
                disabled={loading}
              >
                No
              </button>
              <button
                className=" font-semibold bg-orange-500  text-white text-md py-2 px-4 border w-full text-center border-orange-500  rounded-md hover:bg-orange-600 capitalize"
                type="submit"
                autoFocus
                disabled={loading}
              >
                {loading ? (
                  <Loader className=" w-2 h-2 text-green-700 " size={20} />
                ) : (
                  'Yes'
                )}
              </button>
            </div>
          </form>
        </Typography>
      </Box>
    </Modal>
  );
};

export default BundleConfirmationModel;
