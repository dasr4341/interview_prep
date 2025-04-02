import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { routes } from '@/config/routes';
import Link from 'next/link';
import dummyImage from '@/assets/images/shayan-godarzi-h4thkC_4V14-unsplash.jpg';
import { CarGallery } from '@/generated/graphql';
import { GalleryType } from '@/config/config';

interface ICarListCard {
  carId: string;
  companyName: string;
  launchYear: string;
  model: string;
  totalRun: string;
  variant: string;
  noOfOwners: string;
  transmission: string;
  fuelType: string;
  className?: string;
  gallery: CarGallery[] | undefined | null;
}

const CarListCard = (carDetails: ICarListCard) => {
  const [loading, setLoading] = useState(true);
  const imagesArray = carDetails.gallery?.find(
    (item) => item.fileType === GalleryType.Thumbnail
  );
  const imgURL =
    (imagesArray?.documents && imagesArray?.documents[0]?.path) || '';
  const [imageSrc, setImageSrc] = useState<string>(imgURL);

  useEffect(() => {
    setImageSrc(imgURL || dummyImage.src);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgURL, dummyImage.src]);

  return (
    <Link
      href={routes.buyCars.build(carDetails.carId)}
      className={`max-w-xs mx-auto border cursor-pointer rounded-xl shadow-lg overflow-hidden bg-white transition-all flex flex-col duration-200  ${carDetails?.className} p-1 h-full`}
    >
      <Image
        src={imageSrc}
        alt={`${carDetails?.launchYear} ${carDetails.model} | 
            ${carDetails.companyName}`}
        height={300}
        width={300}
        onLoadStart={() => setLoading(true)}
        onLoadingComplete={() => setLoading(false)}
        onError={() => {
          setImageSrc(dummyImage.src);
          setLoading(false);
        }}
        loader={imageSrc ? () => imageSrc : undefined}
        quality={100}
        priority={true}
        className={`w-full object-cover min-h-36 max-h-36 rounded-t-lg ${loading ? ' bg-gray-500 animate-pulse ' : 'block opacity-100'} `}
      />
      <div className=" bg-blue-50 h-full border-t-blue-300 border px-3 pt-5 pb-2 rounded-b-lg rounded-t-none ">
        <h3 className="text-xs font-semibold text-gray-950 tracking-wide mt-3 capitalize">
          {`${carDetails?.launchYear} ${carDetails.model} | 
            ${carDetails.companyName}`}
        </h3>
        <div className="flex flex-wrap gap-2 items-center mt-3 text-[10px]">
          <span className="text-gray-600 tracking-wide bg-white py-1 px-1.5 rounded-lg ">
            {carDetails.fuelType}
          </span>
          <span className="text-gray-600 tracking-wide bg-white py-1 px-1.5 rounded-lg ">
            {carDetails?.totalRun} Km
          </span>
          <span className="text-gray-600 tracking-wide bg-white py-1 px-1.5 rounded-lg">
            {carDetails.variant}
          </span>
          <span className="text-gray-600 tracking-wide bg-white py-1 px-1.5 rounded-lg">
            {carDetails.noOfOwners} Owners
          </span>
          <span className="text-gray-600 tracking-wide bg-white py-1 px-1.5 rounded-lg">
            {carDetails.transmission}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CarListCard;
