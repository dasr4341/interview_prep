import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { UseFormRegisterReturn } from 'react-hook-form';

import UpArrowIcon from 'Icons/UpArrowIcon';
import { LinearProgressWithLabel } from 'Components/Progressbar/ProgressBar';
import { apiConfig } from 'Lib/Api/api-client';
import messageConfig from 'Lib/message';

export default function ImageTextAreaComponent({
  onChange,
  register,
}: {
  onChange?: (s3_key: string) => void;
  register?: UseFormRegisterReturn;
}) {
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const uploadImage = async (event: any) => {
    if (event.target.files[0]) {
      const bodyFormData = new FormData();
      bodyFormData.append('file', event.target.files[0]);
      const response: any = await apiConfig({
        method: 'post',
        url: 'tiles/upload',
        data: bodyFormData,
        onUploadProgress(progressEvent) {
          if (progressEvent) {
            setUploadProgress(Math.round((100 * progressEvent.loaded) / progressEvent.total));
          }
        },
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (onChange) {
        onChange(response.data.s3_key);
        toast.success(messageConfig.imageUploadSuccess);
      }
    }
  };

  return (
    <div>
      <div className='flex justify-center items-center w-full'>
        <label
          htmlFor='dropzone-file'
          className='flex flex-col justify-center items-center w-full h-56 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100'>
          <div className='flex flex-col justify-center items-center pt-5 pb-6'>
            <UpArrowIcon />
            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold'>Click to upload a tile</span>
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input id='dropzone-file' type='file' className='hidden' onChange={(e) => uploadImage(e)} {...register} />
        </label>
      </div>
      {uploadProgress > 0 && <LinearProgressWithLabel value={uploadProgress} />}
    </div>
  );
}
