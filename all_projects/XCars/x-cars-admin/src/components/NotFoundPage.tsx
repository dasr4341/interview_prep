import { routes } from '@/config/routes';
import Link from 'next/link';
import { RiEyeFill, RiArrowGoBackFill } from 'react-icons/ri';

const NotFoundPage = () => {
  return (
    <div className="w-full h-dvh flex justify-center items-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-2 items-center justify-center text-white text-9xl font-bold">
          <span>4</span>
          <div className="text-9xl flex justify-center items-center w-[76px] h-24 p-1 rounded-full border-[12px] border-orange-600">
            <RiEyeFill className="text-orange-600 w-10" />
          </div>
          <span>4</span>
        </div>
        <div className="flex flex-col gap-1 text-6xl font-semibold items-center">
          <span className="text-white">SORRY, THERE&apos;S</span>
          <span className="text-orange-600">NOTHING HERE</span>
        </div>
        <Link
          className="bg-orange-500 w-fit flex items-center hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md cursor-pointer"
          href={routes.dashboard.path}
          replace={true}
        >
          Return Home <RiArrowGoBackFill className="ms-2" />
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
