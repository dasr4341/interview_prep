import { config } from 'config';
import { differenceInSeconds, format } from 'date-fns';
import { meterToMiles } from 'lib/meter-to-miles';
import {
  FenceAreaType,
  GeoFenceArea,
  GeoFencingPageTypes,
  getColorBasedOnFenceTypes,
  getColorBasedOnId,
  GoogleMapCircle,
} from 'screens/Settings/TotalGeoFencing/TotalGeoFencingView';
import { removeInfoWindow } from './removeInfoWindow';
import { eventEmitter } from 'apiClient';

function computeCircleInfo(
  pageType: GeoFencingPageTypes,
  geoFenceAreaData: GeoFenceArea,
  fenceForPatient: string | undefined | null
) {
  const circleRadius = geoFenceAreaData.radius;
  const showMarker = false;

  if (pageType === GeoFencingPageTypes.TotalGeoFence ) {
    return {
      fillColor: geoFenceAreaData?.patientId
        ? getColorBasedOnId(geoFenceAreaData.patientId || geoFenceAreaData.id)
        : getColorBasedOnFenceTypes(FenceAreaType.global),
      circleRadius,
      showMarker,
    };
  }
  if (pageType === GeoFencingPageTypes.EventGeoFence) {
    return {
      fillColor: getColorBasedOnFenceTypes(circleRadius ?  geoFenceAreaData.areaType : geoFenceAreaData.type),
      circleRadius: circleRadius || 30,
      showMarker,
    };
  }
  if (pageType === GeoFencingPageTypes.TotalLastKnownLocation || pageType === GeoFencingPageTypes.LastKnownLocation) {
    return {
      fillColor: getColorBasedOnId(geoFenceAreaData?.patientId || geoFenceAreaData?.id),
      circleRadius: 10,
      showMarker: true,
    };
  }

  //For ->  pageType === GeoFencingPageTypes.GeoFenceForPatient
  return {
    fillColor: getColorBasedOnFenceTypes(fenceForPatient ? geoFenceAreaData.areaType : FenceAreaType.global),
    circleRadius,
    showMarker,
  };
}


 function getCustomInfoWindowContentString(pageType: GeoFencingPageTypes, geoFenceAreaData: GeoFenceArea) {
  const radius = meterToMiles(Number(geoFenceAreaData.radius || 0));

  let contentString = '<div class="md:w-64 prose xl:w-auto lg:prose-xl p-2">';
  if (geoFenceAreaData?.name) {
    contentString += `<h4 class="mb-0 capitalize">Name: ${geoFenceAreaData.name}</h4>`;
  }
  

  if (pageType === GeoFencingPageTypes.TotalLastKnownLocation || pageType === GeoFencingPageTypes.LastKnownLocation) {
    const fenceCreatedTimeAgo = differenceInSeconds(
      new Date(geoFenceAreaData?.updatedAt || ''),
      new Date(geoFenceAreaData?.createdAt || '')
    );

    contentString += ` <h5 class="mb-0 mt-2 xs text-base " > <b>Known Location:</b> ${geoFenceAreaData?.location || 'NA'} </h5>
    <h5 class="mb-0 mt-2 xs text-base "><b>Time: </b>
           ${format(
             new Date((fenceCreatedTimeAgo > 0 ? geoFenceAreaData.updatedAt : geoFenceAreaData.createdAt) || ''),
             config.dateTimeFormat
           )}
      </h5>
      
      </div>`;
      return contentString;
  } 
    contentString += '<p class="mt-2">';
    contentString +=
    geoFenceAreaData?.location ?
    `<b>Location:</b> ${geoFenceAreaData.location}` : '';
    contentString += `<br/>`;
    contentString +=
      geoFenceAreaData?.type &&
      `
      <b>Trigger Type:</b> ${geoFenceAreaData.type.replaceAll('_', ' ')} <br/>`;

    contentString += !!radius ? `<b>Radius:</b> ${radius} mi<br/>` : '';

    

    contentString += '</p></div>';

  return contentString;
}

function infoWindowHandler(infoWindows: google.maps.InfoWindow[], event: any, mapInstance: google.maps.Map, contentString: string) {
  if (infoWindows) {
    // remove info window
    removeInfoWindow(infoWindows);
  }
  const infoWindowObj = new google.maps.InfoWindow({
    content: contentString,
  });
  infoWindows.push(infoWindowObj);

  infoWindowObj.setPosition(event.latLng);
  infoWindowObj.open(mapInstance);
}


export function createCircle(
  infoWindows: google.maps.InfoWindow[],
  mapInstance: google.maps.Map,
  c: GeoFenceArea,
  pageType: GeoFencingPageTypes,
  patientIdFromUrl?: string | undefined | null
) {
  const { fillColor, circleRadius, showMarker } = computeCircleInfo(pageType, c, patientIdFromUrl);

  const circle = new google.maps.Circle({
    strokeColor: showMarker ? '#579d10' : getColorBasedOnFenceTypes(c.type),
    strokeWeight: showMarker ? 0 : 2,
    fillColor,
    fillOpacity: showMarker ? 0 : 0.4,
    map: mapInstance,
    center: { lat: c.latitude, lng: c.longitude },
    radius: showMarker ? 0 : circleRadius || 10,
  }) as GoogleMapCircle;

  const marker = new google.maps.Marker({
    map: mapInstance,
    opacity: 1,
    position: { lat: c.latitude, lng: c.longitude },
    icon: {
      path: google.maps.SymbolPath.CIRCLE,
      scale: showMarker ? 10 : 1,
      fillOpacity: showMarker ? 1 : 0,
      strokeWeight: showMarker ? 2 : 0,
      fillColor: showMarker ? fillColor : '#579d10',
      strokeColor: showMarker ? getColorBasedOnFenceTypes(c.type) : '#579d10',
    },
  });

  const contentString = getCustomInfoWindowContentString(pageType, c);


  google.maps.event.addListener(marker, 'click', function (event: any) {
    if (c?.multipleData?.length) {
      if (infoWindows) {
        // remove info window
        removeInfoWindow(infoWindows);
      }
      eventEmitter.emit(config.emitter.geofences.onClickMarker, { pageType, data: c });
      return;
    }
    infoWindowHandler(infoWindows, event, mapInstance, contentString);
  });

  google.maps.event.addListener(circle, 'click', function (event: any) {
    if (c?.multipleData?.length) {
      if (infoWindows) {
        // remove info window
        removeInfoWindow(infoWindows);
      }
      eventEmitter.emit(config.emitter.geofences.onClickCircle, { pageType, data: c });
      return;
    }
    infoWindowHandler(infoWindows, event, mapInstance, contentString);
  });

  // close info window when click on map
  google.maps.event.addListener(mapInstance, 'click', function () {
    for (let i = 0; i < infoWindows.length; i++) {
      infoWindows[i].close();
    }
  });

  return { circle, marker, infoWindows };
}



