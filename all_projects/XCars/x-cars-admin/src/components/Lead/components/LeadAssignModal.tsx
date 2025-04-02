import { ASSIGN_LEADS_TO_DEALER } from '@/graphql/assignLeadsToDealer.mutation';
import catchError from '@/lib/catch-error';
import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { Loader } from '@mantine/core';
import { ISelectedRows } from '../LeadsList';
import { routes } from '@/config/routes';
import Link from 'next/link';
import LeadUnAssignResponse from './LeadUnAssignResponse';

interface IModalProps {
  open: boolean;
  onClose: () => void;
  selectedRows: ISelectedRows | null;
  refetch: () => void;
}

export interface IUnAssignResponse {
  customerName: string;
  customerPhone: string | null | undefined;
  carId: string;
  assigned: boolean | null | undefined;
}

const findName = (val: string) => {
  const index = val.indexOf('_');
  return val.slice(index + 1);
};

const LeadAssignModal: React.FC<IModalProps> = ({
  open,
  onClose,
  selectedRows,
  refetch,
}) => {
  const [unAssignResponse, setUnAssignResponse] = useState<
    IUnAssignResponse[] | null | undefined
  >(null);
  const [handleAssignLeadsToDealer, { loading: leadAssignLoading }] =
    useMutation(ASSIGN_LEADS_TO_DEALER, {
      onCompleted(data) {
        const modifiedData = data.assignLeadsToDealer.data?.map((item) => ({
          customerName: item.user?.firstName + ' ' + item.user?.lastName,
          customerPhone: item.user?.phoneNumber,
          carId: item.carId,
          assigned: item.assigned,
        }));
        setUnAssignResponse(modifiedData);
        if (modifiedData?.length) refetch();
      },
      onError(error) {
        catchError(error, true);
      },
    });

  return (
    <>
      {open && (
        <>
          <section className=" absolute bg-overlay top-0 left-0 right-0 bottom-0 z-20  backdrop-blur-sm ">
            <div className="p-6 px-8 flex flex-col gap-1 items-start  bg-white rounded-xl w-[95%] sm:w-[60%] xl:w-[50%] max-w-[450px] 2xl:w-1/2 mx-auto absolute transform left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2">
              <button className="self-end" onClick={() => onClose()}>
                <IoMdClose
                  size={25}
                  className=" text-gray-400 p-1 bg-gray-200 rounded-full"
                />
              </button>
              <h3 className="text-2xl font-bold  mb-4">Summary</h3>
              <table className="w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="font-bold text-gray-800 text-left">
                    <th>Dealer</th>
                    <th>Count</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedRows!).map((item) => (
                    <tr key={item[0]} className=" text-gray-600">
                      <td>
                        <Link
                          target="_blank"
                          className="text-blue-600 underline underline-offset-2"
                          href={`${routes.dashboard.children.dealerDetails.children.dashboard.path(item[0].split('_')[0])}`}
                        >
                          {findName(item[0])}
                        </Link>
                      </td>
                      <td>{item[1].length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={() => {
                  handleAssignLeadsToDealer({
                    variables: { leads: Object.values(selectedRows!).flat() },
                  });
                }}
                className="bg-orange-500 hover:bg-orange-600 duration-300 text-white flex items-center rounded-md px-4 py-1 tracking-wide mt-8 self-end min-w-md"
              >
                Assign
                {leadAssignLoading && <Loader size={16} color={'white'} />}
              </button>
            </div>
          </section>
          {unAssignResponse && (
            <LeadUnAssignResponse
              onClose={() => {
                onClose();
                setUnAssignResponse(null);
              }}
              response={unAssignResponse}
            />
          )}
        </>
      )}
    </>
  );
};

export default LeadAssignModal;
