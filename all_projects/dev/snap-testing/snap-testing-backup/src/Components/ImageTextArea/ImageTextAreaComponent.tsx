/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';

import UpArrowIcon from 'Icons/UpArrowIcon';
import { LinearProgressWithLabel } from 'Components/Progressbar/ProgressBar';
import { apiConfig } from 'Lib/Api/api-client';
import { toast } from 'react-toastify';
// import messageConfig from 'Lib/message';
import CheckIcon from '../../Icons/CheckIcon';
import ErrorIcon from '../../Icons/ErrorIcon';
import MessageComponent from 'Components/MessageComponent/MessageComponent';
import CloseIcon from 'Icons/Close';
import { useParams } from 'react-router-dom';
import { ImageUploadInterface } from 'Interface/Tiles';

export interface MyModalImageInterface {
  img: string;
  loading: number;
  loadingComplete: boolean;
  s3_key: string;
  status?: boolean;
}

function randomDelay() {
  return new Promise((resolve) => setTimeout(resolve, Math.random() * (800 - 400) + 400));
}

export default function ImageTextAreaComponent({
  onTileChange,
}: {
  onTileChange?: (s3_key: ImageUploadInterface[]) => void;
}) {
  const [myModalImage, setMyModalImage] = useState<MyModalImageInterface[]>([]);
  const [resolutionCheck, setresolutionCheck] = useState(false);
  const params = useParams<{ id: string }>();
  const [s3KeyArray, setS3KeyArray] = useState<ImageUploadInterface[]>([]);

  const uploadImages = (event: any) => {
    const imageArray: any = Array.from(event.target.files);
    for (const input of imageArray) {
      if (input && input.size > 2e6) {
        toast.error('File is greater than 2MB');
      } else if (input && input.size < 2e6) {
        // if the size is appropriate
        const img = new Image();
        img.src = window.URL.createObjectURL(input);

        setMyModalImage((e) => [...e, { img: img.src, loading: 0, s3_key: '', loadingComplete: false }]);
        img.onload = async () => {
          await randomDelay();

          if (img.width / img.height === 3 / 5) {
            const bodyFormData = new FormData();
            bodyFormData.append('file', input);

            try {
              const response: any = await apiConfig({
                method: 'post',
                url: 'tiles/upload',
                data: bodyFormData,
                onUploadProgress(progressEvent) {
                  if (progressEvent) {
                    setMyModalImage((e) => {
                      return [
                        ...e.map((el) => {
                          if (el.img === img.src) {
                            el.loading = Math.round((100 * progressEvent.loaded) / progressEvent.total);
                          }
                          return el;
                        }),
                      ];
                    });
                  }
                },
                headers: { 'Content-Type': 'multipart/form-data' },
              });

              // Changes to be made for s3_key
              if (onTileChange) {
                // toast.success(messageConfig.imageUploadSuccess);
                s3KeyArray.push({
                  s3_key: response.data.s3_key,
                  compilation_id: Number(params.id),
                });
                setS3KeyArray(s3KeyArray);
                onTileChange(s3KeyArray);
              }

              setMyModalImage((el) => {
                return [
                  ...el.map((element) => {
                    if (element.img === img.src) {
                      element.status = true;
                      element.s3_key = response.data.s3_key;
                      element.loadingComplete = true;
                    }
                    return element;
                  }),
                ];
              });
            } catch (e: any) {
              if (e.response?.data && e.response?.data.message) {
                toast.error(e.response.data.message);
              } else {
                toast.error('Unable to upload selected image. Possibly already uploaded!');
              }

              setMyModalImage((el) => {
                return [
                  ...el.map((element) => {
                    if (element.img === img.src) {
                      element.status = false;
                      element.loadingComplete = true;
                    }
                    return element;
                  }),
                ];
              });
            }
            setresolutionCheck(false);
          } else {
            setresolutionCheck(true);
          }
        };
      }
    }
  };

  const onDelete = (image: string) => {
    const deletedImageIndex = myModalImage.findIndex((img) => img.img === image);
    myModalImage.splice(deletedImageIndex, 1);
    setMyModalImage(myModalImage);
    s3KeyArray.splice(0, s3KeyArray.length);
    setS3KeyArray(s3KeyArray);
    if (onTileChange) {
      myModalImage.forEach((img) => {
        if (img.s3_key) {
          s3KeyArray.push({
            s3_key: img.s3_key,
            compilation_id: Number(params.id),
          });
        }
      });
      setS3KeyArray(s3KeyArray);
      onTileChange(s3KeyArray);
    }
  };

  return (
    <div>
      <div className='flex flex-col justify-center items-center w-full bg-contain'>
        <div className='grid grid-cols-3 mb-2'>
          {myModalImage &&
            myModalImage.map((img, i) => {
              return (
                <div key={i} className='w-1/2 m-2'>
                  <div className='relative'>
                    <img src={img.img} alt='' />
                    {img.loadingComplete && img?.status === true && (
                      <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
                        <CheckIcon className='w-6 h-6 bg-white rounded-xl ' fill='green' />
                      </div>
                    )}
                    {img.loadingComplete && img?.status === false && (
                      <div className='absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center'>
                        <ErrorIcon className='w-6 h-6 bg-white rounded-xl ' fill='red' />
                      </div>
                    )}
                    <div
                      className='absolute top-0 right-0 rounded-full border border-gray-700 cursor-pointer bg-gray-50'
                      onClick={() => onDelete(img.img)}>
                      <CloseIcon className={'text-gray-400 font-bold'} />
                    </div>
                  </div>
                  {!img.loadingComplete && img.loading >= 0 && img.loading <= 100 && (
                    <LinearProgressWithLabel value={img.loading} />
                  )}
                </div>
              );
            })}
        </div>

        <label
          htmlFor='dropzone-file'
          className='flex flex-col justify-center items-center w-full h-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer hover:bg-gray-100 bg-gray-50'>
          <div className='flex flex-col justify-center items-center pt-5 pb-6'>
            <UpArrowIcon />
            <p className='mb-2 text-sm text-gray-500 dark:text-gray-400'>
              <span className='font-semibold'>Click to upload a tile</span>
            </p>
            <p className='text-xs text-gray-500 dark:text-gray-400'>PNG (3:5 Resolution, Max Size - 2MB) </p>
          </div>
          <input id='dropzone-file' accept='.png' type='file' className='hidden' onChange={uploadImages} multiple />
        </label>
      </div>
      {resolutionCheck && <MessageComponent>{'Only PNG files with 3:5 resolution are accepted'}</MessageComponent>}
    </div>
  );
}
