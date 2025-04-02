import ApproveModal from '@/components/Modal/Modal';
import { Application, Status } from '@/generated/graphql';
import { useDealerStatus } from '@/components/Dealer/hooks/useDealerStatus.hook';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { PiWarningBold } from 'react-icons/pi';

const DangerZone = () => {
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();

  const [triggerStatusChange, setTriggerStatusChange] =
    useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [status, setStatus] = useState<Application>(Application.Disabled);

  const handleTriggerStatusChange = () => {
    setTriggerStatusChange(!triggerStatusChange);
  };

  const dealerDetails = useDealerStatus(
    status,
    dealerId,
    triggerStatusChange,
    handleTriggerStatusChange
  );

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
            onClick={() => {
              setIsModalOpen(true);
            }}
            className={` w-fit flex items-center font-medium py-2 px-4
                     rounded-md cursor-pointer border-white text-white border hover:text-red-500 hover:bg-white `}
          >
            {dealerDetails?.status === Status.Disabled
              ? ' Approve Dealer'
              : 'Disable Dealer'}
          </button>
        </div>
      </div>
      <ApproveModal
        onBlur={() => {}}
        onClose={() => {
          setTriggerStatusChange(false);
          setIsModalOpen(!isModalOpen);
        }}
        onConfirm={() => {
          {
            dealerDetails?.status === Status.Disabled
              ? setStatus(Application.Approved)
              : setStatus(Application.Disabled);
          }
          setTriggerStatusChange(true);
          setIsModalOpen(!isModalOpen);
        }}
        open={isModalOpen}
        title={
          dealerDetails?.status === Status.Disabled
            ? 'Approve Dealer'
            : 'Disable Dealer'
        }
      />
    </>
  );
};

export default DangerZone;
