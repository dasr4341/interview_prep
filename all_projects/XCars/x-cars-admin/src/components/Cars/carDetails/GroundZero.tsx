import ApproveModal from '@/components/Modal/Modal';
import { CarStatus } from '@/generated/graphql';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { PiWarningBold } from 'react-icons/pi';
import useGetCarDetails from '../hooks/useGetCarDetails';
import { useUpdateCarStatus } from '../hooks/useUpdateCarStatus';
import { routes } from '@/config/routes';

const DangerZone = () => {
  const route = useRouter();
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  const { data, refetch } = useGetCarDetails({
    carId,
  });
  const { updateCarStatus } = useUpdateCarStatus({
    onCompleted: () => {
      refetch();
      route.push(
        routes.dashboard.children.carDetails.children.dashboard.path(carId)
      );
    },
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="bg-[#ff5733] py-6 my-10  rounded-lg shadow-lg w-3/4 mx-auto">
        <div className="flex justify-center ">
          <div className="bg-white rounded-full p-6 shadow-md mb-4">
            <PiWarningBold className=" text-red-500" size={40} />
          </div>
        </div>

        <div className="text-center mb-4 text-white font-bold">
          <h2 className="text-2xl">Attention.</h2>
          <p className=" mt-2 text-sm w-3/4 mx-auto">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
            totam adipisci est labore voluptates officiis dolore numquam cumque
            expedita alias.
          </p>
        </div>

        <div className=" flex gap-2 justify-center items-center my-8">
          <button
            disabled={
              data?.getCarDetailAdmin.data.status === CarStatus.Disabled
            }
            onClick={() => setIsModalOpen(true)}
            className={` w-fit flex items-center text-gray-700 font-medium py-2 px-4
                     rounded-md ${data?.getCarDetailAdmin.data.status === CarStatus.Disabled ? ' bg-gray-400 text-white cursor-not-allowed' : 'cursor-pointer border-white text-white border hover:text-red-500 hover:bg-white'}`}
          >
            Disable Car
          </button>
        </div>
      </div>
      <ApproveModal
        onBlur={() => {}}
        onClose={() => {
          setIsModalOpen(!isModalOpen);
        }}
        onConfirm={() => {
          updateCarStatus(carId, CarStatus.Disabled);
          setIsModalOpen(!isModalOpen);
        }}
        open={isModalOpen}
        title="Disable Car?"
      />
    </>
  );
};

export default DangerZone;
