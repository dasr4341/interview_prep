'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Login from './login/Login';
import Register from './register/Register';
import { IoMdClose } from 'react-icons/io';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/store/hooks';
import { appSliceActions } from '@/store/app/app.slice';
import { messageGenerators } from '@/config/messages';

const LoginModal = ({
  modalState,
  onClose,
}: {
  modalState: boolean;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [isLoginComp, setIsLoginComp] = useState<boolean>(true);
  useEffect(() => {
    if (searchParams.get('redirected')) {
      toast.error(messageGenerators.loginRedirect);
      dispatch(appSliceActions.setLoginModel(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleClickClose = () => {
    setIsLoginComp(true);
    router.replace(pathName);
    onClose();
  };

  return (
    <>
      {modalState && (
        <section className="fixed h-dvh bg-overlay top-0 left-0 right-0 z-50 backdrop-blur-sm ">
          <div className=" bg-white grid grid-cols-2 rounded-xl w-[95%] sm:w-[80%] xl:w-[60%] 2xl:w-1/2 mx-auto absolute transform left-1/2 top-1/2 -translate-y-1/2  -translate-x-1/2">
            <div className="hidden md:block md:col-span-1">
              <Image
                className=" rounded-s-xl w-full h-full"
                src="/assets/banner.png"
                width={500}
                height={500}
                alt="Picture of the author"
              />
            </div>
            <div className="px-12 py-6 col-span-2 md:col-span-1 flex flex-col items-start w-full">
              <button className=" self-end" onClick={handleClickClose}>
                <IoMdClose
                  size={30}
                  className=" text-gray-400 p-1 bg-gray-200 rounded-full"
                />
              </button>
              <span className=" font-extrabold text-gray-950 text-xl">
                {isLoginComp ? 'Login' : 'Sign Up'}
              </span>
              <span className=" text-gray-500 font-light text-xl">
                to continue
              </span>

              {isLoginComp ? (
                <Login setIsLoginComp={setIsLoginComp} onClose={onClose} />
              ) : (
                <Register setIsLoginComp={setIsLoginComp} onClose={onClose} />
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default LoginModal;
