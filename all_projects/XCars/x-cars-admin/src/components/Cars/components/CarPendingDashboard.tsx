import React, { ReactNode, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import useCarApproveStatus from '../hooks/useCarApproveStatus';
import { routes } from '@/config/routes';
import { RiBillLine, RiGalleryLine } from 'react-icons/ri';
import { MdOutlineSell } from 'react-icons/md';
import { FaRegCheckCircle } from 'react-icons/fa';
import ApproveModal from '@/components/Modal/Modal';
import {
  Car,
  CarStatus,
  FuelType,
  TransmissionType,
} from '@/generated/graphql';
import { useUpdateCarStatus } from '../hooks/useUpdateCarStatus';
import useGetCarDetails from '../hooks/useGetCarDetails';
import { message } from '@/config/message';
import { RingProgress, Text } from '@mantine/core';
import { config } from '@/config/config';
import { StatusTimeline } from './TimeLine';
import CarDetailsBox from './CarDetailsBox';

export interface ICompletionStatus {
  icon: ReactNode;
  label: string;
  status?: boolean;
  route?: string;
  required: boolean;
  info?: string;
  isDisable?: boolean;
}

export default function CarPendingDashboard({ carData }: { carData?: Car }) {
  const { 'car-detail': carId } = useParams<{ 'car-detail': string }>();

  const {
    checkCarApproveStatusData,
    checkCarApproveStatus,
    checkCarApproveStatusLoading,
  } = useCarApproveStatus({ carId });
  const { refetch } = useGetCarDetails({ carId });
  const { updateCarStatus, loading } = useUpdateCarStatus({
    onCompleted: () => refetch(),
  });

  const [data, setData] = useState<ICompletionStatus[]>([]);
  const [progress, setProgress] = useState(0);
  const [modalState, setModalState] = useState<boolean>(false);

  const reOrderCarApprovalSteps = () => {
    if (checkCarApproveStatusData?.checkCarApproveStatus.data.requiredData) {
      const completionStatuses = [
        {
          icon: <RiGalleryLine size={20} />,
          required: true,
          label: 'Uploads Car Images',
          status:
            checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isCarImageExist,
          route: `${routes.dashboard.children.carDetails.children.gallery.path(carId)}?doc=${config.documents.cars.images.value}`,
          isDisable: false,
        },
        {
          icon: <RiGalleryLine size={20} />,
          required: true,
          label: 'Uploads Car Video',
          status:
            checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isCarVideoExist,
          route: `${routes.dashboard.children.carDetails.children.gallery.path(carId)}?doc=${config.documents.cars.video.value}`,
          isDisable:
            !checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isCarImageExist,
        },
        {
          icon: <RiGalleryLine size={20} />,
          required: true,
          label: 'Uploads Car Thumbnail',
          status:
            checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isThumbnailExist,
          route: `${routes.dashboard.children.carDetails.children.gallery.path(carId)}?doc=${config.documents.cars.thumbnail.value}`,
          isDisable:
            !checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isCarVideoExist,
        },
        {
          icon: <MdOutlineSell size={20} />,
          required: true,
          label: 'Uploads Car Product',
          status:
            checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isCarProductExist,
          route: `${routes.dashboard.children.carDetails.children.products.path(carId)}?doc=${true}`,
          isDisable:
            !checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isThumbnailExist,
        },
        {
          icon: <RiBillLine size={20} />,
          required: true,
          label: 'Uploads Car Quotations',
          status:
            checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isQuotationExist,
          route: `${routes.dashboard.children.carDetails.children.quotations.path(
            carId
          )}?doc=${true}`,
          isDisable:
            !checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isCarProductExist,
        },
        {
          icon: <FaRegCheckCircle size={20} />,
          required: true,
          label: 'Quotation Paid',
          status:
            checkCarApproveStatusData.checkCarApproveStatus.data.requiredData
              .isQuotationPaid,
          info: message.customMessage(
            `If the car approval is awaiting, Please ask the dealer to pay the quotation.`
          ),
        },
      ];

      setData(completionStatuses as ICompletionStatus[]);
      setProgress(
        Math.round(
          (completionStatuses
            .map((step) => step.status)
            .filter((status) => status).length /
            completionStatuses.map((step) => step.route && step.status)
              .length) *
            100
        )
      );
    }
  };

  useEffect(() => {
    if (carId) {
      checkCarApproveStatus(carId);
    }
    reOrderCarApprovalSteps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkCarApproveStatusData, carId]);

  return (
    <div className=" px-6 my-2 items-start  w-full mx-auto">
      <div className=" flex justify-between items-center mb-8 gap-2">
        <div>
          <h2 className="font-bold text-4xl text-blue-600 capitalize">
            Steps for Car Approval
          </h2>
          <p className=" text-sm text-gray-500 font-normal mt-2 tracking-wide max-w-3xl">
            Ensure all required data (images, product details, videos, and
            quotations) are uploaded. Once all steps are completed, your car
            will be ready for approval.
          </p>
        </div>
        <RingProgress
          size={120}
          sections={[{ value: progress, color: 'blue' }]}
          label={
            <Text c="blue" fw={700} ta="center" size="md">
              {progress}%
            </Text>
          }
        />
      </div>

      <div className=" grid grid-cols-12 justify-between items-start gap-8">
        <div className="xl:col-span-7 col-span-12">
          <CarDetailsBox
            car={{
              model: carData?.model || '',
              launchYear: carData?.launchYear || 0,
              companyName: carData?.companyName || '',
              owners: carData?.noOfOwners || 0,
              registrationNumber: carData?.registrationNumber || '',
              transmission: carData?.transmission || TransmissionType.Mt,
              fuel: carData?.fuelType || FuelType.Diesel,
              kmsRun: carData?.totalRun || 0,
              thumbnailUrl:
                carData?.gallery?.find(
                  (item) => item.thumbnail === 'true' && item.documents.length
                )?.documents[0].path || '',
              status: carData?.status || CarStatus.Approved,
            }}
            dealer={{
              id: carData?.user?.id || '',
              firstName: carData?.user?.firstName || '',
              lastName: carData?.user?.lastName || '',
              email: carData?.user?.email || '',
              phone: carData?.user?.phoneNumber || '',
            }}
          />
        </div>
        <div className="xl:col-span-5 col-span-12">
          <StatusTimeline
            data={data}
            loading={checkCarApproveStatusLoading}
            onComplete={() => setModalState(true)}
            disabled={
              !checkCarApproveStatusData?.checkCarApproveStatus.data
                .approveStatus
            }
            approvalFor="Car"
          />
        </div>
      </div>

      <ApproveModal
        onBlur={() => {}}
        loading={loading}
        onClose={() => setModalState(false)}
        onConfirm={() => {
          updateCarStatus(carId, CarStatus.Approved);
          setModalState(false);
        }}
        open={modalState}
        title={`Approve this Car ?`}
      />
    </div>
  );
}
