'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Loader } from '../../Icons/Loader';
import { useMutation } from '@apollo/client';
import { RAISE_QUOTATION } from '@/graphql/raiseQuotation.mutation';
import catchError from '@/lib/catch-error';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { message } from '@/config/message';
import { ErrorMessage } from '@/components/ErrorMessage';
import { RxCross2 } from 'react-icons/rx';

interface IQuotationForm {
  noOfLeads: string;
  validityDays: string;
  amount: string;
}

const schema = yup
  .object({
    noOfLeads: yup.string().required('Please enter no of leads'),
    amount: yup.string().required('Please enter the amount'),
    validityDays: yup.string().required('Please enter the validity period'),
  })
  .required();

export default function RaiseQuotation({
  toggleModal,
  onConfirm,
}: {
  toggleModal: () => void;
  onConfirm: () => void;
}) {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IQuotationForm>({
    resolver: yupResolver(schema),
  });

  const [raiseQuotationCallBack, { loading }] = useMutation(RAISE_QUOTATION, {
    onCompleted: (d) => {
      {
        toast.success(d.raiseQuotation.message);
        toggleModal();
        onConfirm();
        reset();
      }
    },
    onError: (e) => catchError(e, true),
  });

  const onSubmit = (data: IQuotationForm) => {
    if (carId) {
      raiseQuotationCallBack({
        variables: {
          carId: carId,
          noOfLeads: Number(data.noOfLeads),
          validityDays: Number(data.validityDays),
          amount: Number(data.amount),
        },
      });
    }
  };

  useEffect(() => {
    if (!carId) {
      toast.error(message.wrongUrl);
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [carId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg py-8 w-11/12 max-w-lg relative shadow-lg">
        <div className=" flex justify-between items-center w-10/12 mx-auto">
          <h2 className="text-gray-800 text-2xl font-semibold ">
            Raise Quotations
          </h2>
          <button
            onClick={() => toggleModal()}
            className="flex justify-center items-center w-8 h-8 text-gray-800 py-1 bg-gray-200 hover:bg-gray-300 rounded-full"
          >
            <RxCross2 className=" text-gray-400" />
          </button>
        </div>

        <section className=" mx-auto w-10/12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className=" flex flex-col gap-3 mx-auto"
          >
            <label className=" text-md mt-6 text-gray-500">
              Enter quotation amount
            </label>
            <input
              placeholder="Amount to pay"
              type="number"
              className=" bg-gray-100 border text-sm outline-0 border-gray-400 text-gray-600 rounded-md px-4 py-3"
              {...register('amount', {
                required: true,
              })}
            />
            {errors?.amount?.message && (
              <ErrorMessage message={errors?.amount?.message} />
            )}
            <label className=" text-md text-gray-500 mt-1">
              Enter validity days
            </label>
            <input
              placeholder="Valid for no of days"
              type="number"
              className=" bg-gray-100 border text-sm outline-0 border-gray-400 text-gray-600 rounded-md px-4 py-3"
              {...register('validityDays', { required: true })}
            />
            {errors?.validityDays?.message && (
              <ErrorMessage message={errors?.validityDays?.message} />
            )}
            <label className=" text-md text-gray-500 mt-1">
              Enter no of leads
            </label>
            <input
              placeholder=" No of leads "
              type="number"
              className="bg-gray-100 border  text-sm outline-0 border-gray-400 text-gray-600 rounded-md px-4 py-3"
              {...register('noOfLeads', { required: true })}
            />
            {errors?.noOfLeads?.message && (
              <ErrorMessage message={errors?.noOfLeads?.message} />
            )}

            <button
              disabled={loading}
              className=" bg-blue-700 flex flex-row  mt-4 items-center justify-center rounded-md px-4 py-3 cursor-pointer hover:bg-blue-800 tracking-wide text-white font-semibold text-sm "
              type="submit"
            >
              Submit {loading && <Loader />}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
