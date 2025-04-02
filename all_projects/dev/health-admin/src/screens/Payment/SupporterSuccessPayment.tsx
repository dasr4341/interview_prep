import React, { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import SuccessIcon from 'components/icons/SuccessIcon';
import LoginHeader from 'components/LoginHeader';
import { ErrorMessageFixed } from 'components/ui/error/ErrorMessage';
import { supporterPaymentAcceptanceMutation } from 'graphql/supporterPaymentAcceptance.mutation';
import { SupporterPaymentAcceptace, SupporterPaymentAcceptaceVariables } from 'health-generatedTypes';
import { getGraphError } from 'lib/catch-error';
import { useNavigate } from 'react-router-dom';
import { routes } from 'routes';
import WarningIcon from 'components/icons/WarningIcon';
import { useAppDispatch } from 'lib/store/app-store';
import { authSliceActions } from 'lib/store/slice/auth/auth.slice';
import { Loader } from '@mantine/core';

export default function SupporterSuccessPayment() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const stripeSessionId = new URL(window.location.toString()).searchParams.get('session_id');

  const [checkPaymentStatusCallBack, { loading, error, data: paymentStatus }] = useMutation<SupporterPaymentAcceptace, SupporterPaymentAcceptaceVariables>(
    supporterPaymentAcceptanceMutation,
    {
      onCompleted: (d) => {
        if (d.pretaaHealthSupporterPaymentAcceptace?.paidPaymentBy) {
          dispatch(authSliceActions.setUserPaymentStatus(d.pretaaHealthSupporterPaymentAcceptace.paidPaymentBy));
        }
      },
      onError: (e) => console.log(getGraphError(e.graphQLErrors).join(',')),
    }
  );

  useEffect(() => {
    if (stripeSessionId) {
      checkPaymentStatusCallBack({
        variables: {
          stripeSessionId,
        },
      });
    }
    // 
  }, [stripeSessionId]);

  return (
    <div className="h-custom ">
      <LoginHeader className=" h-1/2 md:h-1/2"/>
      <div className="flex flex-col max-w-sm md:w-2/6 mx-auto  py-12 w-4/5 items-center text-center">
        
        {loading && <div className='flex flex-col items-center justify-center'>
          <Loader size={30} color="blue" />
          <div className="mt-4 tracking-wider font-normal">Please wait do not refresh the page</div>
          <div className=' tracking-wide bg-pt-green-150
          p-4 font-light text-sm mt-4'> Note : Money has been debited from your account, please wait while we process the request </div>
        </div>}

        {paymentStatus && paymentStatus?.pretaaHealthSupporterPaymentAcceptace.paidPaymentBy && <div className='flex flex-col items-center mb-4'>
          <SuccessIcon className='w-16 h-16 bg-green rounded-full p-2'/>
          <div className='font-normal text-lg mt-2'>Payment successfully completed</div>
        </div>}

        {paymentStatus && !paymentStatus?.pretaaHealthSupporterPaymentAcceptace.paidPaymentBy && <div className='flex flex-col items-center mb-4'>
          <WarningIcon className='w-16 h-16 bg-red-400 rounded-full p-2'/>
          <div className='font-normal text-lg mt-2'>Payment failed </div>
        </div>}

        {!loading && (
          <>
          <div className=" text-sm font-light text-justify">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae dignissimos voluptatum quod ducimus! Id doloremque omnis rem
          aliquam accusamus cupiditate, molestiae error voluptate sit, ex earum fuga neque ipsam. Eum beatae itaque neque, mollitia
          deleniti distinctio veniam at laudantium dolorem?
        </div>
          <button
            className=" bg-pt-yellow-500 py-2 px-4 w-full mt-8 text-sm md:text-base font-medium rounded-lg"
            onClick={() => navigate(routes.events.default.match)}>
            Continue
          </button>
          </>
        )}
       
      </div>
      {error?.graphQLErrors && <ErrorMessageFixed message={getGraphError(error.graphQLErrors).join(',')} />}
    </div>
  );
}
