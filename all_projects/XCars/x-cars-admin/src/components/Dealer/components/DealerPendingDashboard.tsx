import { StatusTimeline } from '@/components/Cars/components/TimeLine';
import { message } from '@/config/message';
import { routes } from '@/config/routes';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import { RiGalleryLine } from 'react-icons/ri';
import ApproveModal from '@/components/Modal/Modal';
import { useMutation } from '@apollo/client';
import { UPDATE_DEALER_STATUS } from '@/graphql/updateDealerStatus.mutation';
import { toast } from 'react-toastify';
import catchError from '@/lib/catch-error';
import { Application } from '@/generated/graphql';

const DealerPendingDashboard = ({
  isPending,
  refetchDealerDetails,
}: {
  isPending: boolean;
  refetchDealerDetails: () => void;
}) => {
  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();

  const [modalState, setModalState] = useState<boolean>(false);

  const completionStatuses = [
    {
      icon: <RiGalleryLine size={20} />,
      required: true,
      label: 'Uploads Documents',
      status: isPending,
      route: `${routes.dashboard.children.dealerDetails.children.documents.path(dealerId)}?doc=${'documents'}`,
    },
    {
      icon: <FaRegCheckCircle size={20} />,
      required: true,
      label: 'Dealer Ready For Approval',
      status: isPending,
      info: message.customMessage(
        `If the dealer approval is awaiting, Please upload the documents and then approve the dealer.`
      ),
    },
  ];
  const [updateDealerStatus, { loading }] = useMutation(UPDATE_DEALER_STATUS, {
    onCompleted: (d) => {
      refetchDealerDetails();
      setModalState(false);
      toast.success(d.updateDealerStatus.message);
    },
    onError: (e) => catchError(e, true),
  });
  const handleConfirm = () => {
    updateDealerStatus({
      variables: {
        updateDealerStatusId: dealerId,
        status: Application.Approved,
      },
    });
    setModalState(false);
  };

  return (
    <div className=" px-6 my-2 items-start max-w-2xl w-full mx-auto mt-10">
      <div className=" flex justify-between items-center mb-8 gap-2">
        <div>
          <h2 className="font-semibold text-3xl text-blue-600 capitalize">
            Steps for Dealer Approval
          </h2>
          <p className="text-xs text-gray-500 font-normal mt-2">
            Ensure the documents are uploaded. Once the documents will be
            uploaded, dealer will be ready for approval
          </p>
        </div>
      </div>

      <StatusTimeline
        data={completionStatuses}
        loading={false}
        disabled={!isPending}
        onComplete={() => setModalState(true)}
        approvalFor="Dealer"
      />

      <ApproveModal
        onBlur={() => {}}
        loading={loading}
        onClose={() => setModalState(false)}
        onConfirm={handleConfirm}
        open={modalState}
        title={`Approve this dealer ?`}
      />
    </div>
  );
};

export default DealerPendingDashboard;
