import { CareTeamTypes, GetAllCareTeamType_pretaaHealthGetAllCareTeamType } from "health-generatedTypes";
import { DynamicHeaderPatientList } from "screens/Report/interface/dynamicPatientList.interface";
import PatientNameCellRender from "../PatientNameCellRender";
import { CommonColumnConfig } from "screens/Settings/Admin/PatientManagement/components/CommonColumnConfig";
import { formatDate } from "lib/dateFormat";
import { agGridDefaultFilterComparator } from "lib/helperFunction/dateComparator";

export interface NeedingAttentionList {
  id: string;
  name: string | null;
  primaryTherapist: string | null;
  caseManager: string;
  bamR: number;
  bamIop: number;
  gad7: number;
  phq9: number;
  phq15: number;
  urica: number;
  facilityName : string;
  dischargeDate: string | null;
  intakeDate: string | null;
}

export enum NeedingAttentionPatientHeader {
  name = 'name',
  dischargeDate = 'dischargeDate',
  intakeDate = 'intakeDate',
  facilityName = 'facilityName'
}

export function getColsDef(
  cols: any[],
  careTeamLabels: {
    [key: string]: GetAllCareTeamType_pretaaHealthGetAllCareTeamType;
  },
  multipleFacilities: boolean
) {
  return cols.reduce(
    (prevValue, currentValue: { key: string; label: string }) => {
      
      const colDefObj = {
        field: currentValue.key,
        headerName: currentValue.label,
        
      };

      if (currentValue.key.toLowerCase() === NeedingAttentionPatientHeader.name) {
        const nameRow = {
          ...colDefObj,
          cellRenderer: ({ data: patientData }: { data: DynamicHeaderPatientList }) => (
            <PatientNameCellRender
              name={patientData.name}
              patientId={patientData.id}
            />
          ),
          ...CommonColumnConfig,
        };
        prevValue.push(nameRow);
      } else if (currentValue.key === NeedingAttentionPatientHeader.dischargeDate) {
        prevValue.push({ ...colDefObj, sortable: true, filter: 'agDateColumnFilter', filterParams: {
          comparator: agGridDefaultFilterComparator,
          buttons: ['clear']
        }, cellRenderer: ({ data }: { data: NeedingAttentionList }) => (
          <div >{formatDate({ date: data.dischargeDate }) || 'N/A'}</div>
        ), });
      } else if (currentValue.key === NeedingAttentionPatientHeader.intakeDate) {
        prevValue.push({ ...colDefObj, sortable: true, filter: 'agDateColumnFilter', filterParams: {
          comparator: agGridDefaultFilterComparator,
          buttons: ['clear']
        }, cellRenderer: ({ data }: { data: NeedingAttentionList }) => (
          <div >{formatDate({ date: data.intakeDate }) || 'N/A'}</div>
        ), });
      } else if (
        CareTeamTypes.PRIMARY_THERAPIST.toLowerCase().replaceAll('_', '').includes(currentValue.key.toLowerCase())
      ) {
        const obj = { 
          field: currentValue.key,
          headerName: careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST].updatedValue || careTeamLabels[CareTeamTypes.PRIMARY_THERAPIST].defaultValue,
          filterParams: {
            buttons: ['clear'],
          }
        }
        prevValue.push({ ...obj, sortable: true, filter: 'agTextColumnFilter' });
      } else if (
        CareTeamTypes.PRIMARY_CASE_MANAGER.toLowerCase().replaceAll('_', '').includes(currentValue.key.toLowerCase())
      ) {
        const obj = { 
          field: currentValue.key,
          headerName: careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER].updatedValue || careTeamLabels[CareTeamTypes.PRIMARY_CASE_MANAGER].defaultValue,
          filterParams: {
            buttons: ['clear'],
          }
        }
        prevValue.push({ ...obj, sortable: true, filter: 'agTextColumnFilter' });
      } else if (currentValue.key === NeedingAttentionPatientHeader.facilityName) {
        prevValue.push({ ...colDefObj, sortable: true, filter: 'agTextColumnFilter', filterParams: {
          buttons: ['clear'],
        }, suppressColumnsToolPanel: multipleFacilities });
      } else {
        prevValue.push({ ...colDefObj, sortable: true, filter: 'agNumberColumnFilter',  filterParams: {
          buttons: ['clear'],
        } });
      }

      return prevValue;
    },
    [],
  );
}