/*  */
import React, { useEffect, useRef, useState } from 'react';
import './_map.scoped.scss';
import { Modal, Group, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { toast } from 'react-toastify';
import { mapLoader } from 'lib/map-loader';
import { geoFencingMapStyle } from 'screens/Patient/GeoFencing/LastLocations';
import shortId  from 'shortid';

let map: google.maps.Map;
interface GoogleMapCircle extends google.maps.Circle {
  id: string;
}

interface Location {
  lat: number;
  lng: number;
}
interface CircleLocation {
  id: string;
  center: Location;
  radius: number;
}


export default function Map() {
  const [circleLocationsList, setCircleLocationsList] = useState<CircleLocation[]>([
    {
      id: 'm1',
      center: { lat: 41.878, lng: -87.629 },
      radius: 50000,
    },
    {
      id: 'm2',
      center: { lat: 40.714, lng: -74.005 },
      radius: 50000,
    },
  ]);

  const [selectedCircle, setSelectedCircle] = useState<GoogleMapCircle | null>(null);
  const [ciModal, setCiModal] = useState<boolean>(false);
  const [testMarkers, setTestMarkers] = useState<GoogleMapCircle[]>([]);
  const googleMapRef = useRef<any>();

  function initMap(): void {
    console.log(googleMapRef.current);
    // eslint-disable-next-line
    map = new google.maps.Map(googleMapRef.current as HTMLElement, {
      zoom: 5,
      center: { lat: 37.09, lng: -95.712 },
      styles: geoFencingMapStyle,
      streetViewControl: false,
    });
  }

  function createCircle(c: CircleLocation) {
    const marker = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      draggable: true,
      map,
      center: c.center,
      radius: Number(c.radius),
    }) as GoogleMapCircle;
    marker.set('id', c.id);

    setTestMarkers((e) => {
      return [...e, marker] as unknown as GoogleMapCircle[];
    });

    google.maps.event.addListener(marker, 'click', () =>
      handleCircleClick(marker)
    );
    google.maps.event.addListener(marker, 'dragend', (e: any) =>
      updateCircleLocation(marker, e)
    );
  }

  const form = useForm({
    initialValues: {
      radius: 0,
    },
  });

  function handleCircleClick(circle: GoogleMapCircle) {
    setSelectedCircle(circle);
    form.setFieldValue('radius', circle.getRadius());
    setCiModal(true);
  }

  function updateCircleLocation(marker: GoogleMapCircle, e: any) {
    const locations: CircleLocation[] = circleLocationsList;
    const index = locations.findIndex((c) => c.id === marker.id);
    locations[index].center = {
      lat: e.latLng.lat() as number,
      lng: e.latLng.lng() as number,
    };
    setCircleLocationsList(locations);
    marker.setCenter(locations[index].center);
  }

  function addCircle() {
    const uLocation = map.getCenter();
    const uniqueId = shortId();

    if (uLocation) {
      testMarkers.forEach((element: any) => {
        element.setMap(null);
      });
      setTestMarkers([]);

      const location: CircleLocation = {
        id: uniqueId as string,
        center: { lat: uLocation.lat(), lng: uLocation.lng() },
        radius: 50000,
      };

      setCircleLocationsList([...circleLocationsList, location]);

      toast.success('Map circle add successfully.', {
        position: toast.POSITION.TOP_RIGHT,
      });
    } else {
      console.error('Unable to get center position');
    }
  }

  function updateCircle(values: { radius: number }) {
    if (selectedCircle) {
      selectedCircle.setRadius(Number(values.radius));
      setSelectedCircle(null);
      const locations = circleLocationsList;
      const index = locations.findIndex((c) => c.id === selectedCircle.id);
      locations[index].radius = Number(values.radius);
      setCircleLocationsList(locations);
    } else {
      console.error('location not found!');
    }
    setCiModal(false);
  }

  function removeSingleCircle() {
    if (selectedCircle) {
      selectedCircle.setMap(null);
      setCiModal(false);
      toast.error('Map circle removed.');

      for (let i = 0; i < circleLocationsList.length; i++) {
        const obj = circleLocationsList[i];
        // eslint-disable-next-line eqeqeq
        if (obj.id == selectedCircle.id) {
          circleLocationsList.splice(i, 1);
        }
      }
    }
  }

  async function saveData() {
    if (circleLocationsList.length === 0) {
      toast.error('Please select a circle.');
    } else {
      console.log('Output', circleLocationsList);
      toast.success('Circle saved.');
    }
  }

  useEffect(() => {
    setTimeout(() => {
      mapLoader
        .load()
        .then(() => {
          console.log('loaded');
        })
        .catch((e) => console.error(e));
        mapLoader.loadCallback((e) => {
        if (e) {
          console.log(e);
        } else {
          initMap();
        }
      });
    }, 3000);
  }, []);

  function displayCircle() {
    circleLocationsList.forEach((c) => createCircle(c));
  }

  useEffect(() => {
    if (map) {
      displayCircle();
    }

    // 
  }, [circleLocationsList]);

  return (
    <div className="w-full h-full relative">
      <Modal centered opened={ciModal} onClose={() => setCiModal(false)} title="Resize your current circle">
        <form onSubmit={form.onSubmit((values: any) => updateCircle(values))}>
          <TextInput withAsterisk label="Radius (Meter)" placeholder="5000" {...form.getInputProps('radius')} />

          <Group position="right" mt="md">
            <button
              type="submit"
              className="border-yellow-800 hover:bg-yellow-800 bg-yellow-500 hover:text-black 
             font-normal py-2 px-4 rounded inline-flex items-center">
              <span>Update</span>
            </button>
          </Group>
        </form>
        <button
          className="text-white bg-pt-red-800 absolute font-normal py-2 
            px-4 rounded inline-flex items-center hover:bg-orange"
          style={{ bottom: '20px' }}
          type="submit"
          onClick={() => removeSingleCircle()}>
          Remove Circle
        </button>
      </Modal>

      <div
        style={{ position: 'absolute', left: 0, right: 0 }}
        className="bg-white w-3/4 z-50 top-20 mx-auto p-5 rounded-xl g-map-header-container">
        <div className="mx-auto text-center">
          <button
            onClick={addCircle}
            className="border-yellow-800 hover:bg-yellow-800 bg-yellow-500 hover:text-black  font-normal py-2 px-4 rounded inline-flex items-center">
            <span>Add Circle</span>
          </button>
          <button
            onClick={saveData}
            className="border-black hover:bg-yellow-800 bg-black text-yellow-500
           hover:text-black  font-normal py-2 px-4 rounded inline-flex items-center ml-5">
            <span>Save Circle</span>
          </button>
        </div>
      </div>
      <div id="map" ref={googleMapRef} style={{ height: '100%' }}></div>
    </div>
  );
}
