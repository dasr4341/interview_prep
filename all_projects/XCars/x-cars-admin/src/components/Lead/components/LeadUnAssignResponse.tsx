import React from 'react';
import { IoMdClose } from 'react-icons/io';
import { IUnAssignResponse } from './LeadAssignModal';
import Link from 'next/link';
import { routes } from '@/config/routes';

interface IUnAssignProps {
  onClose: () => void;
  response: IUnAssignResponse[];
}

const LeadUnAssignResponse: React.FC<IUnAssignProps> = ({
  onClose,
  response,
}) => {
  return (
    <>
      <section className=" absolute bg-overlay top-0 left-0 right-0 bottom-0 z-20  backdrop-blur-sm ">
        <div className="p-6 px-8 flex flex-col gap-1 items-start  bg-white rounded-xl w-[95%] sm:w-[60%] xl:w-[50%] 2xl:w-1/2 mx-auto absolute transform left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2">
          <button className="self-end" onClick={() => onClose()}>
            <IoMdClose
              size={25}
              className=" text-gray-400 p-1 bg-gray-200 rounded-full"
            />
          </button>
          <h3 className="text-2xl font-bold  mb-4">
            Lead Assign Response Summary
          </h3>
          <table className="w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="font-bold text-gray-800 text-left">
                <th>Customer</th>
                <th>Customer Phone</th>
                <th>Car</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {response?.map((item, index) => (
                <tr key={index} className=" text-gray-600">
                  <td>{item.customerName}</td>
                  <td>{item.customerPhone}</td>
                  <td>
                    <Link
                      target="_blank"
                      className="text-blue-600 underline underline-offset-2"
                      href={routes.dashboard.children.carDetails.children.dashboard.path(
                        item.carId
                      )}
                    >
                      {'View Car'}
                    </Link>
                  </td>
                  <td className="text-sm">
                    {item.assigned ? (
                      <span className="bg-green-500 rouned-full px-2 py-1 text-white capitalize">
                        Assign Success
                      </span>
                    ) : (
                      <span className=" bg-red-500 rouned-full px-2 py-1 text-white capitalize">
                        Assign Failed due to inactive quotation.
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default LeadUnAssignResponse;
