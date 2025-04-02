/* eslint-disable react-hooks/exhaustive-deps */
import Button from 'components/ui/button/Button';
import { useState } from 'react';
import Popup from 'reactjs-popup';
import ProcessingReportPopover from './ProcessingReportPopover';
interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ReportPopOver({ open, setOpen }: Props): JSX.Element {
  const [iSOpen, setiSOpen] = useState(false);
  const [reportType, setReportType] = useState<'pdf' | 'excel'>('pdf');

  const handleClose = () => {
    setOpen(false);
  };
  const popupContentStyle = {
    width: '525px',
  };

  function processReporting() {
    setiSOpen(true);
  }

  return (
    <>
      <Popup
        modal
        open={open}
        arrow={false}
        onClose={handleClose}
        contentStyle={popupContentStyle}
        overlayStyle={{ background: 'rgba(22, 22, 22, 0.2)' }}>
        <div>
          <div className="text-base m-8 font-bold">How Would You like Your Report?</div>
          <div className="flex space-x-4 items-center pl-8 text-sm">
            <input type="radio" className="cursor-pointer" value="pdf" checked={reportType === 'pdf'} onClick={() => setReportType('pdf')} />
            <div>PDF</div>
          </div>
          <div className="flex space-x-4 items-center pl-8 pt-4 pb-6 text-sm">
            <input type="radio" className="cursor-pointer" value="excel" checked={reportType === 'excel'} onClick={() => setReportType('excel')} />
            <div>Excel</div>
          </div>

          <div className="flex flex-1 justify-start mb-5 mt-2 ml-5 text-sm">
            <div>
              <Button onClick={processReporting}>Request</Button>
            </div>
            <div className="ml-4 mt-3">
              <button onClick={handleClose}>Cancel</button>
            </div>
          </div>
          <div></div>
        </div>
        {open && <ProcessingReportPopover open={iSOpen} setOpen={setiSOpen} type={reportType} />}
      </Popup>
    </>
  );
}
