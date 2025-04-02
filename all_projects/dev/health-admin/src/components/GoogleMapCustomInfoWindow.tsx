import React from 'react';
import CloseIcon from './icons/CloseIcon';
import {
  GeoFencingPageTypes,
  GoogleMapCustomInfoWindowDataInterface,
  MultipleGeoFenceDataInterface,
} from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';
import { meterToMiles } from 'lib/meter-to-miles';
import { differenceInSeconds, format } from 'date-fns';
import { config } from 'config';

function InfoWindowCard({
  pageType,
  geoFenceAreaData,
}: {
  pageType: GeoFencingPageTypes;
  geoFenceAreaData: MultipleGeoFenceDataInterface;
}) {
  const radius = meterToMiles(Number(geoFenceAreaData.radius || 0));

  const fenceCreatedTimeAgo = differenceInSeconds(
    new Date(geoFenceAreaData?.updatedAt || ''),
    new Date(geoFenceAreaData?.createdAt || ''),
  );

  return (
    <div className=" p-2 border-2 rounded-md">
      {geoFenceAreaData.name && (
        <div className="mb-0 capitalize text-base">
          <span className=" font-bold">Name:</span> {geoFenceAreaData.name}
        </div>
      )}
      {pageType === GeoFencingPageTypes.TotalLastKnownLocation || pageType === GeoFencingPageTypes.LastKnownLocation ? (
        <>
          
          <div className="mb-0 mt-2 xs text-sm ">
            <span className=" font-semibold">Location:</span> {geoFenceAreaData?.location || 'NA'}
          </div>
          <div className="mb-0 mt-2 xs text-sm ">
            <span className=" font-semibold">Time: </span>
            {format(
              new Date((!!fenceCreatedTimeAgo ? geoFenceAreaData.updatedAt : geoFenceAreaData.createdAt) || ''),
              config.dateTimeFormat,
            )}
          </div>
        </>
      ) : (
        <div className="mt-2 text-sm">
          {geoFenceAreaData?.location && (
            <div>
              <span className=" font-semibold">Location:</span> {geoFenceAreaData.location}
            </div>
          )}
          {geoFenceAreaData?.type && (
            <div>
              <span className=" font-semibold">Trigger Type:</span> {geoFenceAreaData.type.replaceAll('_', ' ')}
            </div>
          )}
          {!!radius && (
            <div>
              <span className=" font-semibold">Radius:</span> {radius} mi
            </div>
          )}
          
        </div>
      )}
    </div>
  );
}

export default function GoogleMapCustomInfoWindow({
  onClose,
  mapData,
}: {
  onClose: () => void;
  mapData: GoogleMapCustomInfoWindowDataInterface;
}) {

  return (
    <section
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      style={{ zIndex: 1000 }}
      className=" flex  flex-col overflow-auto fixed top-0 justify-center content-center items-center left-0 right-0 bottom-0 bg-overlay">
      <div
        className=" bg-white z-50 px-6 pb-2 pt-1 w-10/12 md:w-8/12 h-3/5 flex justify-center items-center flex-col relative rounded"
        onClick={(e) => e.stopPropagation()}>
        <button
          className=" self-end"
          onClick={() => {
            onClose();
          }}>
          <CloseIcon className=" w-4 h-4 cursor-pointer" />
        </button>
        <div className=" mt-6 z-50 w-full h-4/5  flex flex-col overflow-auto space-y-2">
          {!!mapData.pageType &&
            mapData?.data?.multipleData?.map((e) => {
              return (
                <React.Fragment key={`${e.id}`}>
                  <InfoWindowCard
                    pageType={mapData.pageType as GeoFencingPageTypes}
                    geoFenceAreaData={e}
                  />
                </React.Fragment>
              );
            })}
        </div>
      </div>
    </section>
  );
}
