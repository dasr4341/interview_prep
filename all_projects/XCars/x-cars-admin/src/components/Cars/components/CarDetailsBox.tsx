import React from 'react';
import Image from 'next/image';
import { registrationNumberFormatter } from '@/helper/registrationNumberFormatter';
import { CarStatus, FuelType, TransmissionType } from '@/generated/graphql';
import { CgMediaLive } from 'react-icons/cg';
import { SiGoogleearthengine } from 'react-icons/si';
import { IoPerson } from 'react-icons/io5';
import { BsFillFuelPumpFill } from 'react-icons/bs';
import { PiTireFill } from 'react-icons/pi';
import { TbUsersGroup } from 'react-icons/tb';
import { RiArrowDropRightLine } from 'react-icons/ri';
import { routes } from '@/config/routes';
import Link from 'next/link';
import AnalyticsCard from '@/components/Dealer/components/AnalyticsCard';

interface ICar {
  model: string;
  launchYear: number;
  companyName: string;
  owners: number;
  registrationNumber: string;
  transmission: TransmissionType;
  fuel: FuelType;
  kmsRun: number;
  thumbnailUrl: string;
  status: CarStatus;
}
interface IDealer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
interface ICarDetailsBox {
  car: ICar;
  dealer: IDealer;
}

const CarDetailsBox: React.FC<ICarDetailsBox> = ({ car, dealer }) => {
  return (
    <div className=" bg-white rounded-3xl xl:p-6 p-4 shadow-md h-fit">
      <div className="grid grid-cols-12 items-center justify-start gap-4">
        <div className=" col-span-12 text-2xl font-bold text-gray-700 flex gap-4 justify-start items-center">
          {car.status === CarStatus.Approved && (
            <div className=" w-10 h-10 bg-gray-100 rounded-full animate-glow flex justify-center items-center ">
              <CgMediaLive color="green" size={20} />
            </div>
          )}

          <div className=" flex flex-col ">
            <span>
              {car.launchYear} {car.model} {car.companyName}
            </span>
            <div
              className={`w-fit text-xs px-2 py-1 my-1 rounded-xl flex justify-center items-center gap-2 text-white ${car.status === CarStatus.Approved ? 'bg-green-600' : 'bg-orange-600'}`}
            >
              {car.status === CarStatus.Approved ? (
                <>
                  <div className=" bg-white w-2 h-2 rounded-full"></div>
                  <span>Live</span>
                </>
              ) : (
                car.status
              )}
            </div>
          </div>
        </div>

        <div className="xl:col-span-7 col-span-12 my-2">
          <Image
            loader={() => {
              return car.thumbnailUrl ? car.thumbnailUrl : '/images/car.png';
            }}
            src={car.thumbnailUrl || '/images/car.png'}
            width={0}
            height={0}
            objectFit="cover"
            onError={(e) => (e.currentTarget.src = '/images/car.png')}
            className={`rounded-xl mx-auto w-full h-full max-h-[420px]`}
            priority
            alt={'carImage'}
          />
        </div>

        <div className=" xl:col-span-5 col-span-12">
          <div className=" grid grid-cols-12 gap-2">
            <div className="flex gap-2 justify-start items-center text-gray-700 font-semibold text-lg col-span-12 rounded-xl bg-gray-100 p-4">
              <div className=" flex justify-start gap-3 items-center text-gray-800">
                <div className={`rounded-full bg-white`}>
                  <Image
                    src="/images/flag.png"
                    width={30}
                    height={30}
                    objectFit="contain"
                    className=" w-fit h-fit "
                    priority
                    alt="flag"
                  />
                </div>
                {registrationNumberFormatter(car.registrationNumber as string)}
              </div>
            </div>
            <AnalyticsCard
              icon={<IoPerson size={0} />}
              className=" bg-white text-gray-800"
              dataClassName="text-base"
              nameClassName="text-xs text-gray-500"
              data={Number(car.owners || 0)}
              name={'Owners'}
              containerClasses=" bg-theme-red flex-col text-center col-span-6"
            />
            <AnalyticsCard
              icon={<SiGoogleearthengine size={0} />}
              className=" bg-white text-gray-800"
              dataClassName="text-base"
              nameClassName="text-xs text-gray-500"
              data={String(car.transmission || '')}
              name={'Transmission'}
              containerClasses=" bg-theme-yellow flex-col text-center col-span-6"
            />
            <AnalyticsCard
              icon={<BsFillFuelPumpFill size={0} />}
              className=" bg-white text-gray-800"
              dataClassName="text-base"
              nameClassName="text-xs text-gray-500"
              data={String(car.fuel)}
              name={'Fuel'}
              containerClasses=" bg-theme-green flex-col text-center col-span-6"
            />
            <AnalyticsCard
              icon={<PiTireFill size={0} />}
              className=" bg-white text-gray-800"
              dataClassName="text-base"
              nameClassName="text-xs text-gray-500"
              data={Number(car.kmsRun || 0)}
              name="Kms"
              containerClasses=" bg-theme-purple flex-col text-center col-span-6"
            />
          </div>
        </div>

        <div className="col-span-12 bg-gray-100 rounded-xl px-4 py-2 mt-4 flex items-center gap-3 justify-start">
          <div className=" bg-gray-300 p-3 rounded-full w-fit">
            <TbUsersGroup size={25} />
          </div>
          <div className="flex flex-col font-bold">
            <span className=" text-xl text-gray-700">
              {`${dealer.firstName} ${dealer.lastName?.length ? dealer.lastName : ''} `}
            </span>
            <span className=" font-normal tracking-wide my-1 text-sm text-gray-500">
              {`${dealer.phone || ''}${dealer.email ? ' / ' + dealer.email : ''}`}
            </span>
          </div>

          <Link
            className=" ms-auto"
            href={routes.dashboard.children.dealerDetails.children.dashboard.path(
              String(dealer.id)
            )}
          >
            <RiArrowDropRightLine size={30} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CarDetailsBox;
