import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import { CarBundle } from '@/generated/graphql';
import InfoTag from './Infotag';
import { routes } from '@/config/routes';
import { useParams } from 'next/navigation';

export default function BundleCards({
  bundle,
  className,
}: {
  bundle: CarBundle;
  className?: string;
}) {
  const { 'car-detail': carId } = useParams<{
    'car-detail': string;
  }>();

  return (
    <Card sx={{ maxWidth: 345 }} className={className}>
      <CardActionArea
        href={routes.dashboard.children.carDetails.children.bundle.children.path(
          carId,
          bundle.id
        )}
      >
        {/* TODO: Thumbnail image */}
        <div className=" bg-blue-secondary bg-opacity-20 rounded-lg m-2 h-40"></div>
        <CardContent>
          <div className=" flex justify-between items-center text-lg font-bold text-blue-primary ">
            <span className=" capitalize">{bundle.name}</span>
            <span>${bundle.amount}</span>
          </div>

          <div className=" my-4 text-xs text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit consectetur
            adipisicing elit
          </div>

          <div className=" flex gap-2 flex-wrap my-6">
            {bundle.bundleItems.map((item, index) => (
              <InfoTag key={index} value={item.carProducts.fileType} />
            ))}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
