/*  */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { routes } from 'routes';
import { toast } from 'react-toastify';
import { useLazyQuery } from '@apollo/client';

import '../../Settings/Geofencing/_geofencing-list.scoped.scss';
import GeofencingList, { HeaderComponent, toggleGeoFenceListStatus } from 'screens/Settings/Geofencing/GeofencingList';
import {
  GetGeoFencesByPatientId,
  GetGeoFencesByPatientIdVariables,
  GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences,
  UserPermissionNames,
} from 'health-generatedTypes';
import { getGeoFencesQueryById } from 'graphql/geoFencingListByPatientId.query';
import Popover, { PopOverItem } from 'components/Popover';
import GeoFencingSkeletonLoading from 'screens/Settings/Geofencing/SkeletonLoading/geoFencingSkeletonLoading';
import NoDataFound from 'components/NoDataFound';
import { config } from 'config';
import ConfirmationDialog from 'components/ConfirmationDialog';
import UseDeleteGeoFence from './UseDeleteGeoFence';
import GeofencesToogleSwitch from 'screens/Settings/Geofencing/component/geofencesToogleSwitch';
import catchError from 'lib/catch-error';
import { meterToMiles } from 'lib/meter-to-miles';
import TableVirtuosoReact from 'components/table-virtuoso/TableVirtuosoReact';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import useQueryParams from 'lib/use-queryparams';
import { getAppData } from 'lib/set-app-data';

export interface ListDataByIdInterface {
  data: GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences[],
  moreData: boolean;
}

export default function GeoFenceListForPatient() {
  const appData = getAppData();
  const { id, eventId } = useParams();
  const navigate = useNavigate();
  const query = useQueryParams();
  const [listDataById, setListDataById] = useState<ListDataByIdInterface>({
    data: [],
    moreData: true
  });
  const [selectedFenceForDelete, setSelectedForDelete] = useState<string | null>(null);

  const hasEditableGeoFenceForPatient = useGetPrivilege(
    UserPermissionNames.COUNSELLOR_GEOFENCES,
    CapabilitiesType.EDIT
  );

  const [getGeofencingDataById, { loading: loadingGeoDataById }] = useLazyQuery<
    GetGeoFencesByPatientId,
    GetGeoFencesByPatientIdVariables
  >(getGeoFencesQueryById, {
    onCompleted: (data) => {
      if (data.pretaaHealthGetGeoFencesByPatientId?.patientFences) {
        const list = data.pretaaHealthGetGeoFencesByPatientId.patientFences;
        setListDataById({
          moreData: list.length === config.pagination.defaultTake,
          data: (!query.searchedPhase && listDataById.data.length ? listDataById.data : []).concat(list)
        });
      }
    },
    onError: (e) => catchError(e, true),
  });

  function handleEndReach() {
    if (listDataById.moreData) {
      getGeofencingDataById({
        variables: {
          take: listDataById.data.length,
          patientId: String(id)
        }
      })
    }
  }

  const { removeGeoFenceData, fenceDeleteProgress } = UseDeleteGeoFence({
    onCompleted: () => {
      setListDataById({
       ...listDataById,
        data: listDataById?.data.filter((e) => e.id !== selectedFenceForDelete)
      });
      setSelectedForDelete(null);
      toast.success('Geofence deleted successfully');
    },
  });

  function rowRendererVirtue(index: number, data: GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences) {
    return (
      <React.Fragment key={index}>
        <td className="row-element my-1">{data.name}</td>
        <td className="row-element">{meterToMiles(data.radius)} Mile</td>
        <td className="row-element">{data.location}</td>
        <td className="row-element">{data.type.replaceAll('_', ' ')}</td>
        {Number(appData.selectedFacilityId?.length) > 1 && (
          <td className="row-element">{data.facility?.name || 'N/A'}</td>
        )}
        <td className="row-element">
          <div className=" flex justify-between">
            <GeofencesToogleSwitch
              disabled={!data.canEdit || !hasEditableGeoFenceForPatient}
              onSuccess={()=> toggleGeoFenceListStatus(data.id, setListDataById)}
              dataProps={{
                fenceId: data.id,
                fenceStatus: data.status,
              }}
            />
            {(data.canEdit && hasEditableGeoFenceForPatient) &&
            <Popover triggerClass="text-gray-600 focus:text-pt-secondary">
                <PopOverItem onClick={() => {
                  if (location.pathname.includes('events')) {
                    navigate(routes.eventsEditGeoFencing.build(String(eventId), String(id), data.id));
                  } else {
                    navigate(routes.editGeoFencing.build(data.id, id));
                  }
                } }>
                  Edit
                </PopOverItem>
              <PopOverItem onClick={() => setSelectedForDelete(data.id)}>Delete</PopOverItem>
            </Popover>
            }
          </div>
        </td>
      </React.Fragment>
    );
  }

  useEffect(() => {
    if (id) {
      setListDataById({
        moreData: true,
        data: []
      });
       getGeofencingDataById({
      variables: {
        patientId: String(id),
        searchPhrase: query.searchedPhase,
        skip: 0,
        take: config.pagination.defaultTake,
      },
    })
  }
  }, [query.searchedPhase, location.pathname, id]);

  const footerComponent = () => {
    if (!loadingGeoDataById) {
      return (
        <React.Fragment>
          <tr className="absolute left-0 right-0">
            <td className="p-4 text-gray-150 text-sm text-center flex justify-center border-0 bg-gray-100">
              No more data
            </td>
          </tr>
        </React.Fragment>
      );
    } else if (!!listDataById.data?.length && loadingGeoDataById) {
      return (
        <tr className="absolute left-0 right-0">
          
            <GeoFencingSkeletonLoading numberOfRow={listDataById.data.length ? 1 : 0} />
        
        </tr>
      );
    }
  }
  

  return (
    <React.Fragment>
      <div className="overflow-auto mt-5 space-y-4 w-full">
        <div className="font-bold text-md">Global Geofences</div>
        <GeofencingList listHeight={'27vh'} />
      </div>

      <div className="overflow-auto space-y-4 w-full mt-12">
        <div className="flex justify-between">
          <div className="font-bold text-md">Patient Geofences</div>
          <Link to={location.pathname.includes('events') ? routes.eventsCreateGeoFencing.build(String(eventId), String(id)) : routes.createGeoFencing.build(String(id))}>
            <div className="text-pt-blue-300 cursor-pointer">Add new +</div>
          </Link>
        </div>

        {!!listDataById?.data.length && (
          <div className="relative overflow-auto w-full">
            <TableVirtuosoReact
              styles={{ height: '27vh'}}
              data={listDataById.data}
              headerContent={HeaderComponent}
              itemContent={rowRendererVirtue}
              endReached={handleEndReach}
              loadingState={loadingGeoDataById}
              footer={footerComponent}
            />
          </div>
        )}

        {loadingGeoDataById && (
          <GeoFencingSkeletonLoading
            includeHeader={!listDataById.data.length}
            numberOfRow={listDataById.data.length ? 1 : 3}
          />
        )}

        {query.searchedPhase && !loadingGeoDataById && !listDataById.data.length && (
          <NoDataFound
            type="SEARCH"
            heading="No results"
            content="Refine your search and try again"
          />
        )}

        {!query.searchedPhase &&
          !loadingGeoDataById &&
          !listDataById.data.length && (
            <NoDataFound
              type="NODATA"
              heading="No fences yet"
              content="Please add some fences."
            />
          )}

        <ConfirmationDialog
          modalState={Boolean(selectedFenceForDelete)}
          onConfirm={() => {
            removeGeoFenceData({
              variables: {
                fenceId: String(selectedFenceForDelete),
              },
            });
          }}
          disabledBtn={false}
          onCancel={() => setSelectedForDelete(null)}
          className="max-w-sm rounded-xl"
          loading={fenceDeleteProgress}>
          Are you sure you want to delete this Geofence?
        </ConfirmationDialog>
      </div>
    </React.Fragment>
  );
}

