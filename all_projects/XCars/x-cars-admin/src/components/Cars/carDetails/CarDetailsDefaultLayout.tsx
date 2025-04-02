'use client';
import AppNavLink from '@/components/AppNavLink';
import { message } from '@/config/message';
import { routes } from '@/config/routes';
import { CarStatus } from '@/generated/graphql';
import catchError from '@/lib/catch-error';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import useGetCarDetails from '../hooks/useGetCarDetails';
import { config } from '@/config/config';

const searchParams = [
  config.documents.cars.images.value,
  config.documents.cars.video.value,
  config.documents.cars.thumbnail.value,
  'true',
];

export default function CarDetailsDefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const searchParam = useSearchParams().get('doc');
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  const [navLink, setNavLink] = useState(() =>
    Object.values(routes.dashboard.children.carDetails.children).map((nav) => ({
      ...nav,
      icon: nav.icon ?? null,
      isActive: false,
    }))
  );
  const { getCarDetailsCallBack, data } = useGetCarDetails({
    carId,
    onCompleted: (d) => {
      if (
        d?.getCarDetailAdmin.data.status !== CarStatus.Approved &&
        !searchParams.includes(searchParam ?? '')
      ) {
        router.replace(
          routes.dashboard.children.carDetails.children.dashboard.path(carId)
        );
      }
    },
  });

  useEffect(() => {
    if (carId) {
      getCarDetailsCallBack({
        variables: {
          carId: carId,
        },
      });
    } else {
      catchError(message.wrongUrl, true),
        // TODO: navigate to 404 page
        router.replace(routes.dashboard.children.carsListing.path);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId, path]);

  useEffect(() => {
    setNavLink((prev) =>
      prev.map((e) => {
        return {
          ...e,
          isActive: path.includes(e.path(carId)),
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  return (
    <>
      <div className="h-full grid grid-cols-12 bg-gray-50 bg-opacity-30 justify-between ">
        <div className="flex flex-col gap-1.5 col-span-4 lg:col-span-3 xl:col-span-2 h-full px-2 bg-gray-50 overflow-scroll ">
          <div className="text-white py-4 gap-2 flex flex-col">
            <div className="text-xl font-bold  text-gray-800 flex justify-start gap-2 items-center">
              <button
                onClick={() => router.back()}
                className=" text-black cursor-pointer"
              >
                <IoIosArrowBack size={20} />
              </button>
              <div>
                <div className="line-clamp-1">
                  {data?.getCarDetailAdmin.data.model}{' '}
                  {data?.getCarDetailAdmin.data.companyName}{' '}
                </div>
                <div
                  className={`w-fit text-xs px-2 py-0.5 rounded-xl mt-1 flex justify-center items-center gap-2 text-white ${
                    data?.getCarDetailAdmin.data.status === CarStatus.Approved
                      ? 'bg-green-600'
                      : `${
                          data?.getCarDetailAdmin.data.status ===
                          CarStatus.Pending
                            ? 'bg-yellow-500'
                            : `${data?.getCarDetailAdmin.data.status === CarStatus.Disabled ? 'bg-red-500' : 'bg-orange-500'}`
                        }`
                  }`}
                >
                  {data?.getCarDetailAdmin.data.status ===
                  CarStatus.Approved ? (
                    <>
                      <div className=" bg-white w-2 h-2 rounded-full"></div>
                      <span>Live</span>
                    </>
                  ) : (
                    data?.getCarDetailAdmin.data.status
                  )}
                </div>
              </div>
            </div>
          </div>

          {navLink.map((d) => {
            return (
              <AppNavLink
                icon={d.icon}
                key={d.path(carId)}
                isCollapsed={false}
                path={d.path(carId)}
                name={d.name}
                isActive={d.isActive}
                className={` ${
                  (data?.getCarDetailAdmin?.data.status === CarStatus.Pending ||
                    data?.getCarDetailAdmin.data.status === CarStatus.Sold) &&
                  d.path(carId) !==
                    routes.dashboard.children.carDetails.children.dashboard.path(
                      carId
                    )
                    ? ' justify-between flex-row-reverse rounded-none text-gray-400 bg-gray-100 '
                    : d.icon &&
                      'justify-between flex-row-reverse rounded-none text-gray-800 hover:bg-gray-200'
                } `}
                isActiveClassName="bg-gray-200 font-bold"
                isClickable={
                  (data?.getCarDetailAdmin.data.status === CarStatus.Pending ||
                    data?.getCarDetailAdmin.data.status === CarStatus.Sold) &&
                  d.path(carId) !==
                    routes.dashboard.children.carDetails.children.dashboard.path(
                      carId
                    )
                    ? false
                    : true
                }
              />
            );
          })}
        </div>
        <div className="col-span-8 lg:col-span-9 xl:col-span-10 overflow-scroll p-4 bg-gray-100  ">
          {children}
        </div>
      </div>
    </>
  );
}
