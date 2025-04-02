'use client';
import React, { useState } from 'react';
import { Carousel } from '@mantine/carousel';
import videoThumbnail from '../../../../public/assets/videoThumbnail.jpg';
import Image from 'next/image';
import { BsPlayCircle } from 'react-icons/bs';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import styles from './video.module.scss';
import VideoPlayer from './VideoPlayer';
import { IGalleryProps } from '@/components/cars/CarDetails';
import { GalleryType } from '@/config/config';

const CarouselCards = ({ gallery }: { gallery: IGalleryProps[] }) => {
  const [playVideo, setPlayVideo] = useState<string | null>(null);
  const handleClickVideoPlay = (url: string) => {
    setPlayVideo(url);
  };
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Carousel
        withIndicators
        className=" text-white rounded-xl"
        nextControlIcon={
          <IoIosArrowForward className="text-white text-[26px] font-bold" />
        }
        previousControlIcon={
          <IoIosArrowBack className="text-white text-[26px] font-bold" />
        }
        styles={{
          indicator: {
            backgroundColor: 'orange',
            '&[data-inactive]': {
              backgroundColor: 'rgba(255, 165, 0, 0.5)',
            },
            '&[data-active]': {
              backgroundColor: 'orange',
            },
          },
          control: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            padding: '8px',
          },
        }}
      >
        {gallery?.map((ele, index) =>
          ele.type === GalleryType.Images ? (
            <Carousel.Slide key={index}>
              <Image
                onLoadStart={() => setLoading(true)}
                onLoadingComplete={() => setLoading(false)}
                onError={() => setLoading(false)}
                loader={() => ele.path}
                src={ele.path}
                alt="car image"
                priority
                height={300}
                width={300}
                quality={100}
                objectFit="cover"
                objectPosition="center"
                className={`rounded-xl  h-[450px] object-center
                w-full object-cover
                ${loading ? ' bg-gray-500 animate-pulse ' : 'block opacity-100'}`}
              />
            </Carousel.Slide>
          ) : (
            <Carousel.Slide key={index}>
              <div className={styles.videoThumbnail}>
                <Image
                  src={videoThumbnail}
                  alt="image"
                  height={0}
                  width={0}
                  priority
                  className={`rounded-xl w-full h-[450px] object-cover object-center`}
                />
                <button onClick={() => handleClickVideoPlay(ele.path)}>
                  <BsPlayCircle className="text-white absolute top-1/2 left-1/2 text-4xl -translate-x-1/2 -translate-y-1/2" />
                </button>
              </div>
            </Carousel.Slide>
          )
        )}
      </Carousel>
      <VideoPlayer modalState={playVideo} setModalState={setPlayVideo} />
    </>
  );
};

export default CarouselCards;
