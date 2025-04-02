'use client';
import AppNavLink from '@/components/AppNavLink';
import { routes } from '@/config/routes';
import { Status } from '@/generated/graphql';
import { DEALER_DETAILS_QUERY } from '@/graphql/dealerDeatils.query';
import catchError from '@/lib/catch-error';
import { useLazyQuery } from '@apollo/client';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import { IoIosArrowBack } from 'react-icons/io';

export default function DealerDetailsDefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const path = usePathname();
  const searchParam = useSearchParams().get('doc');

  const { 'dealer-detail': dealerId } = useParams<{
    'dealer-detail': string;
  }>();
  const [navLink, setNavLink] = useState(() =>
    Object.values(routes.dashboard.children.dealerDetails.children).map(
      (nav) => ({
        ...nav,
        isActive: false,
      })
    )
  );

  const [fetchDealerDetails, { data }] = useLazyQuery(DEALER_DETAILS_QUERY, {
    onCompleted: (d) => {
      if (
        (d.viewDealer.data?.status === Status.Pending ||
          d.viewDealer.data?.status === Status.Disabled) &&
        !searchParam
      ) {
        router.replace(
          routes.dashboard.children.dealerDetails.children.dashboard.path(
            dealerId
          )
        );
      }
    },
    onError: (e) => catchError(e, true),
  });

  useEffect(() => {
    setNavLink((prev) =>
      prev.map((e) => {
        return {
          ...e,
          isActive: path.includes(e.path(dealerId)),
        };
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);

  useEffect(() => {
    if (dealerId) {
      fetchDealerDetails({
        variables: {
          dealerId: dealerId,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dealerId]);

  return (
    <div className="h-full  grid grid-cols-12 justify-between  bg-gray-100 bg-opacity-30   ">
      <div className="flex flex-col gap-1.5 col-span-4 lg:col-span-3 xl:col-span-2 h-full px-2 bg-gray-50 overflow-scroll">
        <div className="  text-white flex justify-start items-center gap-2 py-4">
          <button onClick={() => router.back()} className=" text-black">
            <IoIosArrowBack size={20} />
          </button>
          <div className="text-2xl font-bold  text-gray-800">
            Dealer Details
          </div>
        </div>
        {navLink.map((d) => (
          <AppNavLink
            icon={d.icon}
            key={d.path(dealerId)}
            isCollapsed={false}
            path={d.path(dealerId)}
            name={d.name}
            isActive={d.isActive}
            isActiveClassName="bg-gray-200 font-bold"
            isClickable={
              data?.viewDealer.data?.status === Status.Pending &&
              d.path(dealerId) !==
                routes.dashboard.children.dealerDetails.children.dashboard.path(
                  dealerId
                )
                ? false
                : true
            }
            className={` ${
              data?.viewDealer.data?.status === Status.Pending &&
              d.path(dealerId) !==
                routes.dashboard.children.dealerDetails.children.dashboard.path(
                  dealerId
                )
                ? 'justify-between flex-row-reverse rounded-none text-gray-400 cursor-not-allowed bg-gray-100 '
                : d.icon &&
                  'justify-between flex-row-reverse rounded-none text-gray-800 hover:bg-gray-200'
            } `}
          />
        ))}
      </div>
      <div className="col-span-8 lg:col-span-9 xl:col-span-10 overflow-scroll p-4 bg-gray-100">
        {children}
      </div>
    </div>
  );
}
