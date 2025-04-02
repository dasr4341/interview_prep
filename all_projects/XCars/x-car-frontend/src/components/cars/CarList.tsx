'use client';
import { CAR_LIST_QUERY } from '@/graphql/carList.query';
import { useLazyQuery } from '@apollo/client';
import React, {
  forwardRef,
  useEffect,
  useState,
  ReactNode,
  CSSProperties,
} from 'react';
import { toast } from 'react-toastify';
import CarListCards from './components/CarListCard';
import {
  CarCountSkeletonLoader,
  CarListSkeletonLoaderGird,
} from './loading/CarListSkeletonLoader';
import Search from '../searchField/Search';
import NoDataFound from '../NoDataFound';
import { useAppSelector } from '@/store/hooks';
import Filter from './components/Filter';
import { configVar } from '@/config/config';
import {
  FuelType,
  TransmissionType,
  TableColumnType,
  CarTableFilter,
  UserCarDetails,
} from '@/generated/graphql';
import { VirtuosoGrid, GridComponents } from 'react-virtuoso';
import ShowAppliedFilters from './components/ShowAppliedFilters';

interface GridComponentProps {
  style?: CSSProperties;
  children?: ReactNode;
}

// Define VirtuosoGrid components
/* eslint-disable  @typescript-eslint/no-explicit-any */
const gridComponents: GridComponents<any> = {
  List: forwardRef<HTMLDivElement, GridComponentProps>(
    ({ style, children, ...props }, ref) => (
      <div
        ref={ref}
        {...props}
        style={{ ...style }}
        className="grid grid-cols-12 gap-4"
      >
        {children}
      </div>
    )
  ),
  Item: ({ children, ...props }: { children?: ReactNode }) => (
    <div
      {...props}
      className="col-span-12 sm:col-span-6 lg:col-span-4 2xl:col-span-3"
    >
      {children}
    </div>
  ),
  ScrollSeekPlaceholder: () => <CarCountSkeletonLoader />,
};

export default function CarList() {
  const [searchedText, setSearchedText] = useState<string | null>(null);
  const [drivenRange, setDrivenRange] = useState({
    min: configVar.drivenMin,
    max: configVar.drivenMax,
  });
  const [noOfOwner, setNoOfOwner] = useState<number>(configVar.ownersMax);
  const [fuelFilter, setFuelFilter] = useState<FuelType[]>([]);
  const [transmissionFilter, setTransmissionFilter] = useState<
    TransmissionType[]
  >([]);

  const currentUser = useAppSelector((state) => state.app.user?.id);

  const [page, setPage] = useState(1);
  const [allCars, setAllCars] = useState<UserCarDetails[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const [getAllCarsCallBack, { loading, data: carsList }] = useLazyQuery(
    CAR_LIST_QUERY,
    {
      onCompleted: (fetchedData) => {
        setAllCars((prevData) => [
          ...prevData,
          ...fetchedData.getCarsUser.data,
        ]);
        setHasMore(fetchedData.getCarsUser.data.length === 20);
      },
      onError: (e) => toast.error(e.message),
    }
  );

  const loadMoreData = () => {
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
      getAllCarsCallBack({
        variables: {
          page: page + 1,
          limit: 20,
          searchString: searchedText,
          filter: [
            {
              column: CarTableFilter.Transmission,
              operator: 'isAnyOf',
              type: TableColumnType.Enum,
              value: transmissionFilter.length
                ? transmissionFilter
                : Object.values(TransmissionType),
            },
            {
              column: CarTableFilter.FuelType,
              operator: 'isAnyOf',
              type: TableColumnType.Enum,
              value: fuelFilter.length ? fuelFilter : Object.values(FuelType),
            },
            {
              column: CarTableFilter.TotalRun,
              operator: '>=',
              type: TableColumnType.Number,
              value: [`${drivenRange.min}`],
            },
            {
              column: CarTableFilter.TotalRun,
              operator: '<=',
              type: TableColumnType.Number,
              value: [`${drivenRange.max}`],
            },
            {
              column: CarTableFilter.NoOfOwners,
              operator: '<=',
              type: TableColumnType.Number,
              value: [`${noOfOwner}`],
            },
          ],
        },
      });
    }
  };

  useEffect(() => {
    setAllCars([]);
    getAllCarsCallBack({
      variables: {
        page: 1,
        limit: 20,
        searchString: searchedText,
        filter: [
          {
            column: CarTableFilter.Transmission,
            operator: 'isAnyOf',
            type: TableColumnType.Enum,
            value: transmissionFilter.length
              ? transmissionFilter
              : Object.values(TransmissionType),
          },
          {
            column: CarTableFilter.FuelType,
            operator: 'isAnyOf',
            type: TableColumnType.Enum,
            value: fuelFilter.length ? fuelFilter : Object.values(FuelType),
          },
          {
            column: CarTableFilter.TotalRun,
            operator: '>=',
            type: TableColumnType.Number,
            value: [`${drivenRange.min}`],
          },
          {
            column: CarTableFilter.TotalRun,
            operator: '<=',
            type: TableColumnType.Number,
            value: [`${drivenRange.max}`],
          },
          {
            column: CarTableFilter.NoOfOwners,
            operator: '<=',
            type: TableColumnType.Number,
            value: [`${noOfOwner}`],
          },
        ],
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchedText,
    currentUser,
    drivenRange,
    noOfOwner,
    fuelFilter,
    transmissionFilter,
  ]);

  return (
    <div className="sm:w-10/12 w-full mx-auto flex gap-6 overflow-hidden">
      <Filter
        drivenRange={drivenRange}
        setDrivenRange={setDrivenRange}
        noOfOwner={noOfOwner}
        setNoOfOwner={setNoOfOwner}
        fuelFilter={fuelFilter}
        setFuelFilter={setFuelFilter}
        transmissionFilter={transmissionFilter}
        setTransmissionFilter={setTransmissionFilter}
      />
      <div className="flex-1 p-1 py-5">
        <h4 className="font-semibold text-xl text-gray-800">
          Discover Your Perfect Pre-Owned Ride with XCars! 🚗
        </h4>
        <div className="font-light text-sm text-md mt-4 h-fit">
          With {loading && <CarCountSkeletonLoader />}
          <span className="font-semibold">
            {carsList?.getCarsUser.pagination?.total} quality used cars
            available,{' '}
          </span>
          <span>
            XCars is here to make your car-buying experience effortless and
            exciting. Whether you&apos;re looking for reliability,
            affordability, or style, our carefully curated selection has
            something for everyone. Start your journey with XCars today and
            drive home your dream car!
          </span>
        </div>
        <Search
          defaultValue={searchedText}
          onChange={(searchedText: string) => {
            setSearchedText(searchedText);
          }}
          className="my-4"
        />
        <ShowAppliedFilters
          transmissionFilter={transmissionFilter}
          setTransmissionFilter={setTransmissionFilter}
          fuelFilter={fuelFilter}
          setFuelFilter={setFuelFilter}
          drivenRange={drivenRange}
          setDrivenRange={setDrivenRange}
          noOfOwner={noOfOwner}
          setNoOfOwner={setNoOfOwner}
        />
        {!!allCars?.length && (
          <div className="flex-1 p-1">
            <div className="mt-3 overflow-scroll h-[calc(100vh-300px)]">
              <VirtuosoGrid
                totalCount={allCars.length}
                components={gridComponents}
                endReached={loadMoreData}
                itemContent={(index) => <CarItemWrapper car={allCars[index]} />}
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="flex-1 py-6">
            <CarListSkeletonLoaderGird />
          </div>
        )}
        {!allCars?.length && !loading && <NoDataFound />}
      </div>
    </div>
  );
}

const CarItemWrapper = ({ car }: { car: UserCarDetails }) => (
  <CarListCards
    key={car.id}
    carId={car.id}
    companyName={car.companyName}
    launchYear={String(car.launchYear || 'NA')}
    model={String(car.model || 'NA')}
    totalRun={String(car.totalRun || 'NA')}
    gallery={car.gallery}
    variant={String(car.variant || 'NA')}
    noOfOwners={String(car.noOfOwners || 'NA')}
    transmission={String(car.transmission || 'NA')}
    fuelType={String(car.fuelType || 'NA')}
  />
);
