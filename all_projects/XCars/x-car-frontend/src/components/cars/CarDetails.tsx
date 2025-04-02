'use client';
import React, { useEffect, useState } from 'react';
import CarouselCards from '../cards/carouseCards/CarouselCards';
import CarProducts from './components/CarProducts';
import { useLazyQuery } from '@apollo/client';
import Button from '../buttons/Button';
import { IoIosArrowBack } from 'react-icons/io';
import { useRouter, useParams } from 'next/navigation';
import catchError from '@/lib/catch-error';
import { routes } from '@/config/routes';
import { CAR_DETAIL_QUERY } from '@/graphql/carDetail.query';
import InfoTag from './components/InfoTag';
import CarDetailsSkeletonLoader from './loading/CarDetailsSkeletonLoader';
import {
  CarGallery,
  ProductType,
  FileType,
  DocumentTypeDocumentType,
  Currency,
} from '@/generated/graphql';
import QuoteModal from '../cards/QuoteModal';
import { GalleryType } from '@/config/config';

export interface IGalleryProps {
  type: string;
  path: string;
}

function formatCarGallery(gallery: CarGallery[] | undefined | null) {
  if (!gallery) return [];
  const images: Array<IGalleryProps> = [];
  const videos: Array<IGalleryProps> = [];

  gallery.forEach((item) => {
    const type = item.fileType;
    if (type === GalleryType.Thumbnail) return;
    item.documents.forEach((document) => {
      const formattedItem = {
        type,
        path: document.path,
      };
      if (type === GalleryType.Video) {
        videos.push(formattedItem);
      } else {
        images.push(formattedItem);
      }
    });
  });

  return [...images, ...videos];
}

interface IProducts {
  productId: string;
  amount: number;
  discountedAmount: number | null | undefined;
  currency: Currency | null | undefined;
  name: FileType;
  thumbnail: string | null | undefined;
  productType: ProductType;
  isBought: boolean;
  documents: {
    name: string;
    path: string;
    documentType: DocumentTypeDocumentType;
  }[];
}

export default function CarDetails() {
  const router = useRouter();
  const { id: carId } = useParams<{ id: string }>();
  const [raiseQuote, setRaiseQuote] = useState(false);
  const [products, setProduct] = useState<IProducts[]>([]);

  const [getCarDetailsCallBack, { loading, data: carDetails }] = useLazyQuery(
    CAR_DETAIL_QUERY,
    {
      onCompleted: (d) => {
        const products =
          d.getCarDetailUser.data?.products?.map((item) => ({
            productId: item.id,
            amount: item.amount,
            discountedAmount: item.discountedAmount,
            currency: item.currency,
            name: item.fileType as FileType,
            thumbnail: item.thumbnail,
            productType: item.productType as ProductType,
            isBought: item.documents ? true : false,
            documents:
              item.documents?.map((doc) => ({
                name: doc.fileName,
                path: doc.path,
                documentType: doc?.documentType as DocumentTypeDocumentType,
              })) || [],
          })) || [];
        setProduct(products);
      },
      onError: (e) => catchError(e, true),
    }
  );

  useEffect(() => {
    if (carId) {
      getCarDetailsCallBack({
        variables: {
          carId,
        },
      });
    } else {
      router.push(routes.buyCars.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  return (
    <>
      {!loading && carDetails?.getCarDetailUser.data && (
        <div className="grid grid-cols-12 md:px-8 p-1 gap-6 lg:w-10/12 w-full mx-auto mt-9">
          <button
            onClick={() => router.replace(routes.buyCars.path)}
            className="w-fit col-span-12 text-blue-600 flex items-center font-thin text-md mb-2"
          >
            <IoIosArrowBack size={20} /> <span>Back</span>
          </button>
          <div className="lg:col-span-7 col-span-12 justify-center ">
            <CarouselCards
              gallery={formatCarGallery(
                carDetails.getCarDetailUser.data?.gallery
              )}
            />
            <CarProducts cardView={true} carId={carId} products={products} />
          </div>
          <div className="lg:col-span-5 col-span-12">
            <div className="border border-gray-300 rounded-xl lg:pt-10 lg:pb-5  md:px-8 px-4 py-2 flex flex-col justify-between">
              <div>
                <div className="lg:text-2xl text-xl font-bold text-gray-800   ">
                  {`${carDetails.getCarDetailUser.data?.launchYear} ${carDetails.getCarDetailUser.data?.model} | ${carDetails.getCarDetailUser.data?.companyName}`}
                </div>

                <div className=" mt-5 flex gap-2 flex-wrap  ">
                  <InfoTag
                    label={`${carDetails.getCarDetailUser.data?.totalRun} Kms`}
                  />
                  <InfoTag label={carDetails.getCarDetailUser.data?.fuelType} />
                  <InfoTag label={carDetails.getCarDetailUser.data?.variant} />
                  <InfoTag
                    label={`${carDetails.getCarDetailUser.data?.noOfOwners} owners`}
                  />
                  <InfoTag
                    label={carDetails.getCarDetailUser.data?.transmission}
                  />
                </div>
              </div>

              <CarProducts carId={carId} products={products} />

              <Button
                onClick={() => {
                  setRaiseQuote(true);
                }}
                className=" py-3 px-2 bg-orange-500 text-white tracking-wide font-bold rounded-lg hover:bg-orange-600 transition duration-300 my-1"
              >
                Raise quote
              </Button>
            </div>
          </div>
        </div>
      )}
      {loading && <CarDetailsSkeletonLoader />}
      {raiseQuote && carDetails?.getCarDetailUser.data?.id && (
        <QuoteModal
          carId={carDetails.getCarDetailUser.data.id}
          raiseQuote={raiseQuote}
          setRaiseQuote={setRaiseQuote}
        />
      )}
    </>
  );
}
