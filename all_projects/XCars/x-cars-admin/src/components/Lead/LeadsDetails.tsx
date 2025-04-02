/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { useParams, useRouter } from 'next/navigation';
import { useLazyQuery } from '@apollo/client';
import { GET_LEADS_QUERY } from '@/graphql/getAdminLeads.query';
import catchError from '@/lib/catch-error';
import { message } from '@/config/message';
import { toast } from 'react-toastify';
import {
  CarStatus,
  FuelType,
  LeadsStatus,
  LeadType,
  TransmissionType,
} from '@/generated/graphql';
import { LEAD_PAYMENT_HISTORY } from '@/graphql/leadPaymentHistory.query';
import Link from 'next/link';
import CarDetailsBox from '../Cars/components/CarDetailsBox';

export default function LeadsDetails() {
  const { 'lead-id': leadId } = useParams<{ 'lead-id': string }>();
  const router = useRouter();

  const [getLeadsDetails, { data }] = useLazyQuery(GET_LEADS_QUERY, {
    onError: (e) => catchError(e, true),
  });

  const [getLeadPurchaseHistory, { data: purchaseHistory }] = useLazyQuery(
    LEAD_PAYMENT_HISTORY,
    {
      onError: (e) => catchError(e, true),
    }
  );

  useEffect(() => {
    if (leadId) {
      getLeadsDetails({
        variables: {
          leadId: leadId,
        },
      });
    } else {
      toast.error(message.wrongUrl);
    }
  }, [leadId]);

  useEffect(() => {
    if (data) {
      getLeadPurchaseHistory({
        variables: {
          userId: data.getAdminLeads.data[0].userId,
        },
      });
    }
  }, [leadId, data]);

  return (
    <div className="bg-white rounded-xl py-4 px-14 my-6 md:my-0">
      <div className=" w-full flex items-center my-5 gap-4">
        <button
          onClick={() => router.back()}
          className="  text-teal-900 font-extrabold text-sm text-center"
        >
          <IoIosArrowBack size={25} />
        </button>
        <div className="flex items-center gap-4 ">
          <span className=" text-3xl font-bold  text-gray-700  ">
            Lead Details
          </span>
          <div className={`flex gap-2 text-sm items-center justify-end`}>
            <span
              className={`text-white capitalize ${data?.getAdminLeads.data[0].status === LeadsStatus.Assigned ? 'bg-orange-500' : 'bg-purple-400'} px-4 py-0.5 rounded-full`}
            >
              {data?.getAdminLeads.data[0].status.toLowerCase()}
            </span>
            <span
              className={`text-white capitalize ${data?.getAdminLeads.data[0].leadType === LeadType.HotLead ? 'bg-red-500' : 'bg-green-500'} px-4 py-0.5 rounded-full`}
            >
              {data?.getAdminLeads.data[0].leadType
                .replace('_', ' ')
                .toLowerCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-5 ">
        <div className=" xl:col-span-6 col-span-12">
          {data?.getAdminLeads.data[0].car && (
            <CarDetailsBox
              car={{
                model: data?.getAdminLeads.data[0].car.model || '',
                launchYear: data?.getAdminLeads.data[0].car.launchYear || 0,
                companyName: data?.getAdminLeads.data[0].car.companyName,
                owners: data?.getAdminLeads.data[0].car.noOfOwners || 0,
                registrationNumber:
                  data?.getAdminLeads.data[0].car.registrationNumber || '',
                transmission:
                  data?.getAdminLeads.data[0].car.transmission ||
                  TransmissionType.Mt,
                fuel:
                  data?.getAdminLeads.data[0].car.fuelType || FuelType.Diesel,
                kmsRun: data?.getAdminLeads.data[0].car.totalRun || 0,
                thumbnailUrl:
                  data?.getAdminLeads.data[0].car.carGallery?.find(
                    (item) =>
                      item.thumbnail === 'true' &&
                      item.CarGalleryDocuments.length
                  )?.CarGalleryDocuments[0].path || '',
                status:
                  data?.getAdminLeads.data[0].car.status || CarStatus.Approved,
              }}
              dealer={{
                id: data?.getAdminLeads.data[0].user?.id || '',
                firstName: data?.getAdminLeads.data[0].user?.firstName || '',
                lastName: data?.getAdminLeads.data[0].user?.lastName || '',
                email: data?.getAdminLeads.data[0].user?.email || '',
                phone: data?.getAdminLeads.data[0].user?.phoneNumber || '',
              }}
            />
          )}
        </div>

        <div className=" xl:col-span-6 col-span-12 shadow-lg px-4 py-2 rounded-2xl">
          <h2 className="font-bold text-2xl text-gray-700 my-4 ">
            Purchase History
          </h2>
          {purchaseHistory?.getPaymentHistoryList.data?.map((item) => (
            <div
              key={item.id}
              className="flex flex-row justify-between items-start text-text-purple rounded-md my-2 px-6 py-4 bg-gray-100 "
            >
              <div>
                <div className=" flex flex-col ">
                  {!item.bundleDetails ? (
                    item.productsPurchased?.map((products) => (
                      <div key={products.id}>
                        <strong>{products.fileType}</strong> (
                        {products.currency} {products.amount})
                      </div>
                    ))
                  ) : (
                    <div>
                      <strong>{item.bundleDetails.fileType}</strong> (
                      {item.bundleDetails.currency} {item.bundleDetails.amount})
                    </div>
                  )}
                </div>
              </div>
              <div className=" flex flex-col justify-center items-start ">
                {item.receipt && (
                  <Link
                    target="_blank"
                    href={item.receipt}
                    className=" text-blue-600 capitalize underline mb-2 text-sm"
                  >
                    view receipt
                  </Link>
                )}
                <span className=" font-semibold text-md ">
                  Rs.{item.amount}{' '}
                </span>
              </div>
            </div>
          ))}
          {!purchaseHistory?.getPaymentHistoryList.data?.length && (
            <div className="text-center text-gray-400 my-auto">
              No data found!!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
