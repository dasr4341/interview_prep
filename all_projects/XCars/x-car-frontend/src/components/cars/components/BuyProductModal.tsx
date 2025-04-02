/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useRazorpay, RazorpayOrderOptions } from 'react-razorpay';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdClose } from 'react-icons/io';
import ProductListItem from './ProductListItem';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CREATE_ORDER_MUTATION } from '@/graphql/createOrder.mutation';
import { VERIFY_PAYMENT_MUTATION } from '@/graphql/verifyPayment.mutation';
import {
  CreateOrderForEndUserMutation,
  DocumentTypeDocumentType,
  ProductType,
  VerifyRazorpayPaymentForEndUserMutationVariables,
} from '@/generated/graphql';
import { BiShow } from 'react-icons/bi';
import { config } from '@/config/config';
import { CurrencyCode } from 'react-razorpay/dist/constants/currency';
import { toast } from 'react-toastify';
import { routes } from '@/config/routes';
import { Loader } from '@mantine/core';
import Link from 'next/link';
import catchError from '@/lib/catch-error';
import { ISelectedProduct } from './CarProducts';
import { useAppDispatch } from '@/store/hooks';
import { getAppData } from '@/lib/appData';
import { GET_CAR_BUNDLE } from '@/graphql/getCarBundle.query';
import VideoPlayer from '@/components/cards/carouseCards/VideoPlayer';
import { appSliceActions } from '@/store/app/app.slice';

const listItems = [
  'Life time access',
  'Minor cosmetic imperfections are not repaired as they do not affect performance, and reduces the cost of ownership',
  'Some parts have been repainted for better aesthetics. However, we assure the car is non-accidental',
];

const BuyProductModal = ({
  carId,
  selectedProduct,
  onClose,
}: {
  carId: string;
  selectedProduct: ISelectedProduct | null;
  onClose: (refreshPage?: boolean) => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [bundleData, setBundleData] = useState<string | undefined>();
  const [viewVideo, setViewVideo] = useState<string | null>(null);
  const [razorPayInfoAfterPayment, setRazorPayInfoAfterPayment] = useState<{
    data: VerifyRazorpayPaymentForEndUserMutationVariables;
    status: 'success' | 'error';
  } | null>(null);

  const { Razorpay } = useRazorpay();

  const handleLogin = () => {
    dispatch(appSliceActions.setLoginModel(true));
    onClose(false);
  };

  const [getCarBundleCallback] = useLazyQuery(GET_CAR_BUNDLE, {
    onCompleted: (data) => {
      setBundleData(
        data.getCarBundle.data?.bundledItems
          .map((item) => item.CarProduct.fileType)
          .join(' + ')
      );
    },
    onError: (e) => catchError(e, true),
  });

  const [placeOrderCallback, { loading: placeOrderLoading }] = useMutation(
    CREATE_ORDER_MUTATION,
    {
      onCompleted(data) {
        payWithRazorPay(data);
      },
      onError: (e) => {
        catchError(e);
        handleLogin();
      },
    }
  );

  const [verifyPaymentCallback, { loading: verifyPaymentLoading }] =
    useMutation(VERIFY_PAYMENT_MUTATION, {
      onCompleted(data) {
        const orderId = data.verifyRazorpayPaymentForEndUser.data.paymentId; //returned by the verify payment
        router.push(routes.account.children.orders.build(orderId));
        onClose();
      },
      // onError: (e) => catchError(e, true),
    });

  function afterPayment(
    _status: 'failed' | 'success',
    data?: {
      razorpayOrderId: string;
      razorpayPaymentId: string;
      razorpaySignature: string;
    }
  ) {
    if (razorPayInfoAfterPayment || data) {
      verifyPaymentCallback({
        variables: razorPayInfoAfterPayment?.data || data,
      });
    }
  }

  function payWithRazorPay(data: CreateOrderForEndUserMutation) {
    const { __typename, ...options } = data.createOrderForEndUser.order;
    const { __typename: prefill__typename, ...prefill } = options.prefill;
    const { __typename: theme__typename, ...theme } = options.theme;
    const orderInfoOptions: RazorpayOrderOptions = {
      key: config.razorpay.razorpaySignature,
      ...options,
      amount: Number(options.amount),
      currency: options.currency as CurrencyCode,
      prefill,
      theme,
      modal: {
        ondismiss() {
          afterPayment('failed');
        },
      },
      handler: (response) => {
        const data = {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        };
        setRazorPayInfoAfterPayment({ data, status: 'success' });
        afterPayment('success', data);
      },
    };
    const razorpayInstance = new Razorpay(orderInfoOptions);
    razorpayInstance.open();
    razorpayInstance.on('payment.failed', (response) => {
      setRazorPayInfoAfterPayment({
        data: {
          razorpayOrderId: response.error.metadata.order_id,
          razorpayPaymentId: response.error.metadata.payment_id,
          razorpaySignature: config.razorpay.razorpaySignature,
        },
        status: 'error',
      });
    });
  }

  const initiatePlaceOrder = () => {
    if (!getAppData().token) {
      handleLogin();
      return;
    }
    if (carId && selectedProduct?.productType === ProductType.Bundle) {
      placeOrderCallback({
        variables: {
          carId,
          bundleId: selectedProduct.productId,
        },
      });
    } else if (carId && selectedProduct?.productId) {
      placeOrderCallback({
        variables: {
          carId,
          products: [selectedProduct.productId],
        },
      });
    } else {
      toast.error("Can't not place order");
    }
  };

  useEffect(() => {
    if (
      carId &&
      selectedProduct?.productId &&
      selectedProduct?.productType === ProductType.Bundle
    ) {
      getCarBundleCallback({
        variables: {
          carId,
          bundleId: selectedProduct.productId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct]);

  return (
    <section
      className={`${selectedProduct ? 'fixed bg-overlay top-0 left-0 right-0 bottom-0 z-50  backdrop-blur-sm ' : 'hidden'}   `}
    >
      <div className="p-8 pb-12 flex flex-col gap-1 items-start  bg-white rounded-xl w-[95%] sm:w-[60%] xl:w-[50%] max-w-[450px] 2xl:w-1/2 mx-auto absolute transform left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2">
        <button className="self-end" onClick={() => onClose()}>
          <IoMdClose
            size={30}
            className=" text-gray-400 p-1 bg-gray-200 rounded-full"
          />
        </button>
        <div className="text-2xl font-bold text-gray-800 capitalize mb-2">
          <span> {selectedProduct?.name?.toLowerCase()}</span>
          {selectedProduct?.productType === ProductType.Bundle && (
            <div className="text-lg">
              <span>{bundleData?.toLowerCase()}</span>
              <span className="bg-green-600 text-xs ms-2 text-white rounded-full px-2 py-0.5">
                Bundle
              </span>
            </div>
          )}
        </div>
        <p className="text-sm font-extralight text-gray-500 line-clamp-2">
          Level up with more power and enhanced features. Everything you need to
          create your website. Enjoy optimized performance & guaranteed
          resources.
        </p>

        <div className="flex flex-col gap-1 mt-8">
          {listItems.map((item, index) => (
            <ProductListItem key={index} item={item} />
          ))}
        </div>

        {!selectedProduct?.isBought && (
          <div className="flex flex-row item-center justify-between w-full mt-8">
            <div className="flex items-end  text-gray-700">
              <span>Rs. </span>
              <span className="text-4xl font-semibold">
                {selectedProduct?.discountedAmount}.00
              </span>
            </div>
            <button
              disabled={placeOrderLoading || verifyPaymentLoading}
              onClick={initiatePlaceOrder}
              className="text-lg px-6 py-1  mt-6 ms-auto bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-300 flex gap-2 items-center"
            >
              {razorPayInfoAfterPayment?.status === 'success' ? (
                <span> Paid successfully </span>
              ) : (
                <span>Buy Now</span>
              )}
              {(placeOrderLoading || verifyPaymentLoading) && (
                <Loader size={18} color="white" />
              )}
            </button>
          </div>
        )}
        {selectedProduct?.isBought && (
          <div className=" flex flex-col items-start mt-8 gap-4">
            {selectedProduct?.documents?.map(
              (e, i) =>
                e.path && (
                  <>
                    {e.documentType !== DocumentTypeDocumentType.Video ? (
                      <Link
                        key={i}
                        target="_blank"
                        className=" bg-orange-500 capitalize rounded-md px-4 py-2 text-white font-semibold flex items-center gap-3"
                        href={e.path}
                      >
                        <BiShow className="text-2xl" />
                        {e.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => setViewVideo(e.path!)}
                        className="bg-orange-500 capitalize rounded-md px-4 py-2 text-white font-semibold flex items-center gap-3"
                      >
                        <BiShow className="text-2xl" />
                        {e.name}
                      </button>
                    )}
                  </>
                )
            )}
          </div>
        )}
        {viewVideo && (
          <VideoPlayer modalState={viewVideo} setModalState={setViewVideo} />
        )}
      </div>
    </section>
  );
};

export default BuyProductModal;
