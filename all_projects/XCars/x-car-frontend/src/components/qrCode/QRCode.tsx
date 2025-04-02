'use client';
import React, { useState } from 'react';
import { config } from '@/config/config';
import Button from '@/components/buttons/Button';
import { FaArrowLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { routes } from '@/config/routes';

const QRCode2 = () => {
  const router = useRouter();
  const [copied, setCopied] = useState<boolean>(false);

  const handleClickBack = () => {
    router.push(routes.buyCars.path);
  };
  const handleCopyURL = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
    navigator.clipboard.writeText(config.app.downloadAppUrl);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex flex-col items-center bg-white rounded-md p-8">
        <Button onClick={handleClickBack} className="p-0 me-auto mb-12">
          <div className="bg-gray-200 p-2 rounded-full">
            <FaArrowLeft size={'20px'} color="gray" />
          </div>
        </Button>
        <h3 className="text-xl font-semibold">
          Our representative will contact you soon.
        </h3>
        <div className="mt-10 flex flex-col gap-4">
          <p className="text-gray-900">Scan QR Code to download App</p>
          <QRCode value={config.app.downloadAppUrl} />
          <p className="text-center">-- or --</p>
        </div>
        <div className="flex shadow-[0_20px_60px_20px_rgba(0,0,0,0.05)] rounded-md bg-white my-8">
          <p className="p-3 ps-8 w-56 truncate">{config.app.downloadAppUrl}</p>
          <button
            onClick={handleCopyURL}
            className={`border-l p-3 pr-8 border-gray-300 ms-4 w-36`}
          >
            {copied ? 'Copied' : 'Copy URL'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCode2;
