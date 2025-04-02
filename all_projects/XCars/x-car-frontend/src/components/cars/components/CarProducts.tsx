'use client';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../scss/car.module.scss';
import { FiLock } from 'react-icons/fi';
import BuyProductModal from './BuyProductModal';
import { IoDocumentText } from 'react-icons/io5';
import { MdOutlineKeyboardArrowRight } from 'react-icons/md';
import ThumbnailDummyImage from '@/assets/images/dummyThumbnail.png';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ProductType,
  FileType,
  DocumentTypeDocumentType,
} from '@/generated/graphql';

interface IDocType {
  path?: string;
  name: string;
  documentType?: DocumentTypeDocumentType | undefined;
}
export interface ISelectedProduct {
  productId?: string;
  amount: number;
  discountedAmount?: number | null;
  currency?: string | null;
  name: FileType;
  productType: ProductType;
  thumbnail: string | null | undefined;
  documents: Array<IDocType> | undefined;
  isBought: boolean;
}

function CardView({
  ele,
  setSelectedProduct,
}: {
  ele: ISelectedProduct;
  setSelectedProduct: Dispatch<SetStateAction<ISelectedProduct | null>>;
}) {
  const router = useRouter();
  const pathname = usePathname();
  console.log({ pathname });

  return (
    <div className="flex flex-col bg-gray-100 rounded-xl col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-6 xl:col-span-4 shadow-md">
      <div className={`relative flex-none ${styles.lockedImage}`}>
        <Image
          src={ele?.thumbnail || ThumbnailDummyImage.src}
          loader={
            ele.thumbnail
              ? () => String(ele.thumbnail)
              : () => ThumbnailDummyImage.src
          }
          onError={(e) => {
            e.currentTarget.src = ThumbnailDummyImage.src;
          }}
          alt="image"
          width={150}
          height={250}
          className="object-cover object-center rounded-b-none rounded-xl w-full aspect-video"
        />
        <div className="rounded-xl backdrop-blur-[2px] absolute inset-0 flex items-center justify-center transition-opacity duration-300 hover:cursor-pointer ">
          {!ele.isBought && <FiLock className="text-white text-2xl" />}
        </div>
      </div>
      <div className="flex flex-col gap-1 h-full p-2 py-3">
        <p className="text-sm text-gray-700 capitalize">
          {ele.name?.toLowerCase()}{' '}
          {ele.productType === ProductType.Bundle && (
            <span className="bg-green-600 text-xs text-white rounded-full px-2 py-0.5">
              bundle
            </span>
          )}
        </p>
        <div className="flex items-center justify-between mt-2">
          {ele.isBought ? (
            <span className="text-xs font-semibold bg-green-600 text-white rounded-sm px-4 py-1 italic">
              Bought
            </span>
          ) : (
            <div className="flex items-center gap-1">
              {ele?.discountedAmount === ele?.amount ? (
                <span className="text-xl text-slate-900 font-medium">
                  ₹{ele?.discountedAmount}
                </span>
              ) : (
                <>
                  <span className="text-xl text-slate-900 font-medium">
                    ₹{ele?.discountedAmount}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{ele?.amount}
                  </span>
                  {ele?.discountedAmount && (
                    <span className="text-sm font-medium text-green-600">
                      {Math.round(
                        ((ele?.amount - ele?.discountedAmount) * 100) /
                          ele?.amount
                      )}
                      % off
                    </span>
                  )}
                </>
              )}
            </div>
          )}
          <button
            className="text-xs px-4 py-1 bg-orange-500 text-white rounded-sm hover:bg-orange-600 transition duration-300"
            onClick={() => {
              setSelectedProduct(ele);
              router.push(`${pathname}?view=${ele.name}`);
            }}
          >
            View More
          </button>
        </div>
      </div>
    </div>
  );
}

function ListView({
  ele,
  setSelectedProduct,
}: {
  ele: ISelectedProduct;
  setSelectedProduct: Dispatch<SetStateAction<ISelectedProduct | null>>;
}) {
  return (
    <div
      onClick={() => setSelectedProduct(ele)}
      className=" flex items-center cursor-pointer text-xs text-center gap-2 hover:underline"
    >
      <IoDocumentText size={15} />
      View <span className=" font-semibold capitalize">{ele.name}</span>
      <MdOutlineKeyboardArrowRight size={15} />
    </div>
  );
}

const CarProducts = ({
  carId,
  products,
  cardView,
}: {
  carId: string;
  products: ISelectedProduct[] | null | undefined;
  cardView?: boolean;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const viewedProducts = searchParams.get('view');

  const [selectedProduct, setSelectedProduct] =
    useState<ISelectedProduct | null>(null);

  const handleModalClose = (refreshUrl: boolean = true) => {
    setSelectedProduct(null);
    if (refreshUrl && viewedProducts) {
      router.push(pathname);
    }
  };

  useEffect(() => {
    if (!selectedProduct && viewedProducts && cardView) {
      const soldProduct =
        products?.find((ele) => ele.name.trim() === viewedProducts.trim()) ||
        null;
      setSelectedProduct(soldProduct);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedProducts, products]);

  return (
    <div
      className={`${cardView ? 'grid grid-cols-12 overflow-x-auto items-center gap-5 my-8 w-full' : 'text-blue-700 flex flex-col gap-2 my-10 font-medium'}`}
    >
      {cardView &&
        products?.map(
          (ele, index) =>
            ele && (
              <CardView
                ele={ele}
                setSelectedProduct={setSelectedProduct}
                key={index}
              />
            )
        )}
      {!cardView &&
        products?.map(
          (ele, index) =>
            ele && (
              <ListView
                ele={ele}
                key={index}
                setSelectedProduct={setSelectedProduct}
              />
            )
        )}
      <BuyProductModal
        carId={carId}
        selectedProduct={selectedProduct}
        onClose={(refreshPage?: boolean) => handleModalClose(refreshPage)}
      />
    </div>
  );
};

export default CarProducts;
