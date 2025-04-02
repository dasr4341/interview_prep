import React, { useEffect, useState } from 'react';
import LoginHeader from 'components/LoginHeader';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import Button from 'components/ui/button/Button';
import { ErrorMessage } from 'components/ui/error/ErrorMessage';
import { useAppSelector } from 'lib/store/app-store';
import { UserTypeRole } from 'health-generatedTypes';
import useSelectedRole from 'lib/useSelectedRole';

export default function SupporterPayment() {
  const navigate = useNavigate();
  const [stripeState, setStripeState] = useState<any>();
  const [stripeError, setStripeError] = useState<null | string>(null);
  const [isLoading, setLoading] = useState(false);
  const isSupporter = useSelectedRole({ roles: [UserTypeRole.SUPPORTER] });

  

  const stripeData = useAppSelector(state => state.auth.user?.pretaaHealthCurrentUser);
  if (!stripeData?.stripePublishableKey || !stripeData.stripePriceId ) {
    setStripeError('Payment details not found');
  }
  const getStripe = async () => {
    if (!stripeState && isSupporter) {
      setStripeState(loadStripe(String(stripeData?.stripePublishableKey)));
    }
    return stripeState;
  };

  // stripe
  const redirectToCheckout = async () => {
    setLoading(true);
    try {
      const checkoutOptions = {
        lineItems: [
          {
            price: stripeData?.stripePriceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        successUrl: `${window.location.origin}/subscription/payment/successful?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscription/payment/cancel?session_id={CHECKOUT_SESSION_ID}`,
      };
      const stripe = await getStripe();
      if (stripe) {
        const { error } = await stripe.redirectToCheckout(checkoutOptions);
        if (error) setStripeError(error.message);
      }
    } catch (e: any) {
      setStripeError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!stripeState) {
      getStripe();
    }
    // 
  }, []);

  return (
    <div className="h-custom ">
      <LoginHeader className=" h-1/2 md:h-1/2" title="Billing information" />
      <div className="flex flex-col max-w-sm md:w-2/6 mx-auto py-12 w-4/5">
        <div className=" text-sm font-light text-justify">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae dignissimos voluptatum quod ducimus! Id doloremque omnis rem
          aliquam accusamus cupiditate, molestiae error voluptate sit, ex earum fuga neque ipsam. Eum beatae itaque neque, mollitia deleniti
          distinctio veniam at laudantium dolorem?
        </div>
        <Button
          disabled={!!stripeError || isLoading}
          loading={isLoading}
          className=" bg-pt-yellow-500 py-2 px-4 w-full mt-8 text-sm md:text-base font-medium rounded-lg"
          onClick={() => redirectToCheckout()}>
         Continue to pay
        </Button>
        <div className="text-center md:text-base text-sm font-medium mt-4" onClick={() => navigate(-1)}>
          Back
        </div>
        {stripeError && <ErrorMessage message={stripeError} />}
      </div>
    </div>
  );
}
