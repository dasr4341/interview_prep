import React, { useState } from 'react';

import FitbitConnect from '../../../assets/images/fitbit-connect.png';
import { useNavigate } from 'react-router-dom';
import Button from 'components/ui/button/Button';
import { routes } from 'routes';
import ConfirmationDialog from 'components/ConfirmationDialog';
import CloseIcon from 'components/icons/CloseIcon';
import { TabNames } from './lib/apple-onboarding-interface';
import './_apple-onboarding-connect.scoped.scss';
import FitbitPlayButton from 'components/icons/FitbitPlayButton';
import AppleOnboardingLogoutButton from './component/AppleOnboardingLogoutButton';

export default function AppleOnboardingConnectPage() {
  const navigate = useNavigate();
  const [needHelpModal, setNeedHelpModal] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);

  return (
    <div>
      <section className="text-gray-700 mt-3 lg:mt-16">
        <div className="md:flex justify-center gap-10 2xl:gap-24">
          <div className=" w-32 md:w-56 mx-auto md:mx-0 md:pb-6 lg:pb-0">
            <img
              src={FitbitConnect}
              alt="fitbit_connect"
            />
            <div className="flex justify-center mt-4">
              <button onClick={() => setPlayVideo(true)}>
                <FitbitPlayButton />
              </button>
            </div>
          </div>
          <div className="border-r border-gray-200 md:block"></div>
          <div className="">
            <div className="font-semibold text-center md:text-left text-gray-850 text-base md:pl-12 tracking-widest pt-8 uppercase text-color">
              It takes commitment
            </div>
            <div className="w-56 mx-auto md:mx-0 fitbit-border-text -mt-2"></div>
            <div className="lg:py-5 lg:w-1/2 text-center md:text-left ">
              <div className=" mb-10 md:mb-0">
                <div className=" text-width md:pl-4 lg:pb-8">
                  <h2 className="text-gray-900 px-3 md:px-0 text-smd mb-3 font-light leading-relaxed text-size">
                    Click the button below to connect your
                    <span className="font-bold"> Apple Watch</span>
                  </h2>
                </div>
                <button
                  className="font-medium text-xss text-black pb-5 underline md:pl-4 lg:mb-8 hidden"
                  onClick={() => setNeedHelpModal(true)}>
                  Need Help?
                </button>
                <div className="flex md:block justify-center md:justify-start pb-3">
                  <Button
                    size="md"
                    onClick={() => navigate(routes.appleOnboarding.connect.build(TabNames.INSTALL))}
                    className="ml-2 md:ml-4 truncate text-sm sm:text-base">
                    <span className="px-12">Connect Apple Watch </span>
                  </Button>
                </div>
                <AppleOnboardingLogoutButton/>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="px-5">
        <ConfirmationDialog
          hideBtns={true}
          modalState={needHelpModal}
          onCancel={() => setNeedHelpModal(false)}
          className="max-w-sm rounded-xl pb-10">
          <div className="pb-5">
            <div className="flex justify-between">
              <div></div>

              <button
                onClick={() => setNeedHelpModal(false)}
                className="pb-4">
                <CloseIcon className="  w-6 h-6 bg-gray-200 p-1 rounded-full cursor-pointer" />
              </button>
            </div>
            It is a long established fact that a reader will be distracted by the readable content of a page when
            looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of
            letters, as opposed to using 'Content here, content here', making it look like readable English.
          </div>
        </ConfirmationDialog>
      </div>

      {/* play video */}
      <ConfirmationDialog
        hideBtns={true}
        modalState={playVideo}
        onCancel={() => setPlayVideo(false)}
        className="max-w-sm rounded-xl pb-10">
        <div className="pb-5">
          <div className="flex justify-between">
            <div></div>

            <button
              onClick={() => setPlayVideo(false)}
              className="pb-4">
              <CloseIcon className="  w-6 h-6 bg-gray-200 p-1 rounded-full cursor-pointer" />
            </button>
          </div>

          <video
            autoPlay
            loop
            muted>
            <source
              src="/video/pretaa-health-watch-onboarding.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </ConfirmationDialog>
    </div>
  );
}
