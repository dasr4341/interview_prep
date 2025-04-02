/* eslint-disable react-hooks/exhaustive-deps */
import Popup from 'reactjs-popup';
import iconClose from 'assets/icons/icon_close-1.svg';
import { gsap } from 'gsap';
import getReport from 'lib/api/get-report';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'lib/store/app-store';
import { controlPanelActions } from 'lib/store/slice/control-panel';
import { toast } from 'react-toastify';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: 'pdf' | 'excel'; 
}

export default function ProcessingReportPopOver({ open, setOpen, type }: Props): JSX.Element {
  const dispatch = useDispatch();
  const [isDownloaded, setIsDownloaded] = useState(false);
  const customerId = useSelector((state: RootState) => state.controlPanel.exportClientId);

  const handleClose = () => {
    setOpen(false);
  };
  const popupContentStyle = {
    width: '525px',
  };

  async function handleOpen() {
    if (!isDownloaded) {
      const t = gsap.timeline();
      t.to('svg #background', { y: -123, duration: 20, });
      if (customerId) {
        try {
          await getReport({ customerId: customerId, type });
          dispatch(controlPanelActions.updateClientId(null));
          t.seek(100);
          setIsDownloaded(true);
        } catch (e) {
          toast.error('Unable to generate report');
        }
      }
      
    }
  }

  return (
    <>
      <Popup
        modal
        open={open}
        arrow={false}
        onClose={handleClose}
        onOpen={handleOpen}
        contentStyle={popupContentStyle}
        overlayStyle={{ background: 'rgba(22, 22, 22, 0.2)' }}>
        <div>
          <div className="flex justify-end">
            <button onClick={handleClose}>
              <img src={iconClose} alt="loader" />
            </button>
          </div>
          <div className="pt-5">
            <div className="flex justify-center pb-5">
              <svg width="101" height="123" viewBox="0 0 101 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect y="123" width="101" height="123" fill="#6F9AF1" id="background" />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M101 0H0V123H101V0ZM31.9735 49.3813V72.8628H53.706C65.7071
 72.8628 75.4385 62.3515 75.4385 49.3813C75.4385 36.4101 65.7071 25.8978 53.706 25.8978C41.7018 
 25.8978 31.9735 36.4101 31.9735 49.3813ZM53.706 90.7618H31.9735V114.01H14V49.3814C14 26.5277
  31.7761 8 53.706 8C75.6328 8 93.4099 26.5277 93.4099 49.3814C93.4099 72.2342 75.6328 
  90.7618 53.706 90.7618Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M31.9735 72.8628H31.4735V73.3628H31.9735V72.8628ZM14 114.01H13.5V114.51H14V114.01ZM31.9735
 114.01V114.51H32.4735V114.01H31.9735ZM32.4735 72.8628V49.3813H31.4735V72.8628H32.4735ZM32.4735 
 49.3813C32.4735 36.6491 42.0137 26.3978 53.706 26.3978V25.3978C41.3899 25.3978 31.4735
  36.1712 31.4735 49.3813H32.4735ZM53.706 26.3978C65.3952 26.3978 74.9385 36.6491 
  74.9385 49.3813H75.9385C75.9385 36.1711 66.019 25.3978 53.706 25.3978V26.3978ZM74.9385 
  49.3813C74.9385 62.1124 65.3952 72.3628 53.706 72.3628V73.3628C66.0189 73.3628 
  75.9385 62.5905 75.9385 49.3813H74.9385ZM53.706 72.3628H31.9735V73.3628H53.706V72.3628ZM31.9735
   91.2618H53.706V90.2618H31.9735V91.2618ZM53.706 91.2618C75.9283 91.2618 93.9099 72.4906 
   93.9099 49.3814H92.9099C92.9099 71.9777 75.3374 90.2618 53.706 90.2618V91.2618ZM93.9099 
   49.3814C93.9099 26.2712 75.9283 7.5 53.706 7.5V8.5C75.3374 8.5 92.9099 26.7841 92.9099 
   49.3814H93.9099ZM53.706 7.5C31.4807 7.5 13.5 26.2712 13.5 49.3814H14.5C14.5 26.7841
    32.0715 8.5 53.706 8.5V7.5ZM13.5 49.3814V114.01H14.5V49.3814H13.5ZM14 
    114.51H31.9735V113.51H14V114.51ZM32.4735 114.01V90.7618H31.4735V114.01H32.4735Z"
                  fill="#3B7AF7"
                />
              </svg>
            </div>
            <div className="text-center pb-8">
              {isDownloaded && (
                <>
                  <div className="font-bold text-base pb-1">Your report has been processed!</div>
                </>
              )}
              {!isDownloaded && (
                <>
                  <div className="font-bold text-base pb-1">Your report is processing...</div>
                  <div className="text-sm text-gray-600 tracking-tighter">
                    Your report will automatically download, once ready.
                  </div>
                </>  
              )}
              
            </div>
          </div>
        </div>
      </Popup>
    </>
  );
}
