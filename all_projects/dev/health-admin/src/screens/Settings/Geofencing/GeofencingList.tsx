import React, { useContext, useEffect, useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import './_geofencing-list.scoped.scss';
import { config } from 'config';
import {
  GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences,
  ListGeoFences,
  ListGeoFencesVariables,
  ListGeoFences_pretaaHealthListGeoFences,
  UserPermissionNames
} from 'health-generatedTypes';
import { getGeoFencesQuery } from 'graphql/geoFencingList.query';
import Popover, { PopOverItem } from 'components/Popover';
import GeoFencingSkeletonLoading from './SkeletonLoading/geoFencingSkeletonLoading';
import NoDataFound from 'components/NoDataFound';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import GeofencesToogleSwitch from './component/geofencesToogleSwitch';
import ConfirmationDialog from 'components/ConfirmationDialog';
import UseDeleteGeoFence from 'screens/Patient/GeoFencing/UseDeleteGeoFence';
import catchError from 'lib/catch-error';
import { meterToMiles } from 'lib/meter-to-miles';
import { ListDataByIdInterface } from 'screens/Patient/GeoFencing/GeoFenceListForPatient';
import TableVirtuosoReact from 'components/table-virtuoso/TableVirtuosoReact';
import { routes } from 'routes';
import useGetPrivilege, { CapabilitiesType } from 'lib/getPrivilege';
import { getAppData } from 'lib/set-app-data';
import { HeaderContext } from 'components/ContentHeaderContext';
import { useViewportSize } from '@mantine/hooks';
import useQueryParams from 'lib/use-queryparams';

export interface ListDataInterface {
  data: ListGeoFences_pretaaHealthListGeoFences[];
  moreData: boolean;
}

export function toggleGeoFenceListStatus(
  fenceId: string,
  updaterFun:
    | React.Dispatch<React.SetStateAction<ListDataInterface>>
    | React.Dispatch<React.SetStateAction<ListDataByIdInterface>>
) {
  updaterFun((list: any) => {
    return {
      ...list,
      data: list.data.map(
        (
          row:
            | GetGeoFencesByPatientId_pretaaHealthGetGeoFencesByPatientId_patientFences
            | ListGeoFences_pretaaHealthListGeoFences
        ) => {
          if (row.id === fenceId) {
            return {
              ...row,
              status: !row.status,
            };
          }
          return row;
        }
      ),
    };
  });
}

export function HeaderComponent() {
  const appData = getAppData();
  return (
    <tr className="bg-gray-50">
      <td className="row-header font-bold text-base ">Name</td>
      <td className="row-header font-bold text-base ">Radius</td>
      <td className="row-header font-bold text-base ">Location</td>
      <td className="row-header font-bold text-base ">Type</td>
      {Number(appData.selectedFacilityId?.length) > 1 && (
        <td className="row-header font-bold text-base ">Facility Name</td>
      )}
      
      <td className="row-header font-bold text-base ">Status</td>
    </tr>
  );
}

export default function GeofencingList({ listHeight }: { listHeight?: string }) {
  const appData = getAppData();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const query = useQueryParams();
  const path = location.pathname.includes('/geofencing/list');
  const [listData, setListData] = useState<ListDataInterface>({
    data: [],
    moreData: true,
  });
 
  const [selectedFenceForDelete, setSelectedForDelete] = useState<string | null>(null);
  
  const hasEditableGeoFence = useGetPrivilege(
    UserPermissionNames.GEOFENCES,
    CapabilitiesType.EDIT
  );

  const { removeGeoFenceData, fenceDeleteProgress } = UseDeleteGeoFence({
    onCompleted: () => {
      setListData({
        ...listData,
        data: listData.data.filter((e) => e.id !== selectedFenceForDelete),
      });
      setSelectedForDelete(null);
      toast.success('Geofence deleted successfully');
    },
  });

  const [getGeoFencesData, { loading: loadingListGeoFences }] = useLazyQuery<ListGeoFences, ListGeoFencesVariables>(
    getGeoFencesQuery,
    {
      onCompleted: (d) =>
        d.pretaaHealthListGeoFences &&
        setListData({
          moreData: d.pretaaHealthListGeoFences.length === config.pagination.defaultTakeForGeofence,
          data: (!query.searchedPhase && listData?.data.length ? listData.data : []).concat(d.pretaaHealthListGeoFences),
        }),
      onError: (e) => catchError(e, true),
    }
  );

  function rowRendererVirtue(index: number, fence: ListGeoFences_pretaaHealthListGeoFences) {
    return (
      <React.Fragment key={index}>
        <td className="row-element my-1">{fence.name}</td>
        <td className="row-element">{meterToMiles(fence.radius)} mi</td>
        <td className="row-element">{fence.location}</td>
        <td className="row-element">{fence.type.replaceAll('_', ' ')}</td>
        {Number(appData.selectedFacilityId?.length) > 1 && (
          <td className="row-element">{fence.facility?.name || 'N/A'}</td>
        )}
        <td className="row-element">
          <div className=" flex justify-between">
            <GeofencesToogleSwitch
              disabled={!fence.canEdit || !hasEditableGeoFence}
              isNotEditable={!hasEditableGeoFence || !fence.canEdit}
              onSuccess={() => toggleGeoFenceListStatus(fence.id, setListData)}
              dataProps={{
                fenceId: fence.id,
                fenceStatus: fence.status
              }}
            />
            {
              (fence.canEdit && hasEditableGeoFence)  && <Popover triggerClass="text-gray-600 focus:text-pt-secondary">
              <PopOverItem onClick={() => {
                  if (location.pathname.includes(routes.listView.build(String(params.id)))) {
                    navigate(routes.editGeoFencing.build(fence.id, params.id));
                  } else {
                    navigate(routes.geofencing.updateGeoFencing.build(String(fence.id)));
                  }
               }}>
              Edit
            </PopOverItem>
            <PopOverItem onClick={() => setSelectedForDelete(fence.id)}>Delete</PopOverItem>
          </Popover>
            }


          </div>
        </td>
      </React.Fragment>
    );
  }

  function handleEndReach() {
    if (listData.moreData) {
      getGeoFencesData({
        variables: {
          skip: listData.data.length,
        },
      });
    }
  }

  useEffect(() => {
    setListData({
      moreData: true,
      data: []
    });
    getGeoFencesData({
      variables: {
        searchPhrase: query.searchedPhase,
        skip: 0,
        take: config.pagination.defaultTakeForGeofence,
      },
    });
  // 
  }, [query.searchedPhase, location.pathname]);


  const { height } = useViewportSize();

  const { headerHeight } = useContext(HeaderContext);

  const footerComponent = () => {
    if (!loadingListGeoFences) {
      return (
        <React.Fragment>
          <tr className="absolute left-0 right-0">
            <td className="p-4 text-gray-150 text-sm text-center flex justify-center border-0 bg-gray-100">
              No more data
            </td>
          </tr>
        </React.Fragment>
      );
    } else if (!!listData.data?.length && loadingListGeoFences) {
      return (
        <tr className="absolute left-0 right-0">
          
            <GeoFencingSkeletonLoading numberOfRow={listData.data.length ? 1 : 0} />
        
        </tr>
      );
    }
  }

  return (
    <React.Fragment>
      {!!listData.data.length && (
        <div className="overflow-auto w-full">
          <TableVirtuosoReact
            styles={{ height: listHeight ? listHeight : `${height - headerHeight - 145}px` }}
            data={listData.data}
            headerContent={HeaderComponent}
            itemContent={rowRendererVirtue}
            endReached={handleEndReach}
            loadingState={listData.moreData}
            footer={footerComponent}
          />
        </div>
      )}
      {loadingListGeoFences && listData.data.length === 0 && (
        <GeoFencingSkeletonLoading
          includeHeader={!listData.data.length}
          numberOfRow={3}
        />
      )}

      {query.searchedPhase && !loadingListGeoFences && !listData.data.length && (
       <div
       className={`h-max flex justify-center items-center`}
       style={{ height: path ? `${height - headerHeight - 145}px` : '' }}>
       <NoDataFound
         type="SEARCH"
         heading="No results"
         content="Refine your search and try again"
       />
     </div>
      )}

      {!query.searchedPhase &&
        !loadingListGeoFences &&
        !listData.data.length && (
          <div
          className="flex justify-center items-center"
          style={{ height: path ? `${height - headerHeight - 145}px` : '' }}>
          <NoDataFound
            type="NODATA"
            heading="No fences are there"
            content="Please add some fences."
          />
        </div>
        )}

      <ConfirmationDialog
        modalState={Boolean(selectedFenceForDelete)}
        onConfirm={() =>
          removeGeoFenceData({
            variables: { fenceId: String(selectedFenceForDelete) },
          })
        }
        disabledBtn={false}
        onCancel={() => setSelectedForDelete(null)}
        className="max-w-sm rounded-xl"
        loading={fenceDeleteProgress}>
        Are you sure you want to delete this Geofence?
      </ConfirmationDialog>
    </React.Fragment>
  );
}


