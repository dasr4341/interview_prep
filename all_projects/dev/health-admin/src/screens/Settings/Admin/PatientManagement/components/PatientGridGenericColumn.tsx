import { ICellRendererParams } from '@ag-grid-community/core';

import { formatDate } from 'lib/dateFormat';
import { PatientListHeader } from '../helper/PatientManagementHelper';

export default function PatientGridGenericColumn(props: ICellRendererParams) {
  const colId = props.column?.getColId() as string;
  const data = props.data;

  return (
    <div>
      {colId === PatientListHeader.name && <div className = 'capitalize'>{data.name}</div>}

      {colId === PatientListHeader.gender && (
        <div className='capitalize'>  {data.gender}</div>
      )}

      {colId === PatientListHeader.genderIdentity && (
        <div>
          {(data.genderIdentity === 'null' && 'N/A') ||
            (data.genderIdentity === 'undefined' && 'N/A') ||
            data.genderIdentity}
        </div>
      )}

      {colId === PatientListHeader.dob && <div>{formatDate({ date: data?.dob,  timeZone: data.patientTimezone }) || 'N/A'}</div>}

      {colId === PatientListHeader.trackLocation && <div className="capitalize">{data.trackLocation}</div>}

      {colId === PatientListHeader.careTeamsCol && <div>{data.careTeamsCol}</div>}

      {colId === PatientListHeader.email && <div>{data.email}</div>}

      {colId === PatientListHeader.phone && <div>{data.phone}</div>}

      {colId === PatientListHeader.intakeDate && <div>{formatDate({ date: data?.intakeDate, timeZone: data?.patientTimezone }) || 'N/A'}</div>}

      {colId === PatientListHeader.dischargeDate && <div>{formatDate({ date: data?.dischargeDate, timeZone: data.patientTimezone, formatStyle: 'date-time' }) || 'N/A'}</div>}

      {colId === PatientListHeader.race && <div>{data.race}</div>}

      {colId === PatientListHeader.ethnicity && <div>{data.ethnicity}</div>}

      {colId === PatientListHeader.addressStreet && <div>{data.addressStreet}</div>}

      {colId === PatientListHeader.addressStreet2 && <div>{data.addressStreet2}</div>}

      {colId === PatientListHeader.addressCity && <div>{data.addressCity}</div>}

      {colId === PatientListHeader.addressCountry && <div>{data.addressCountry}</div>}

      {colId === PatientListHeader.state && <div>{data.state}</div>}

      {colId === PatientListHeader.addressZip && <div>{data.addressZip}</div>}

      {colId === PatientListHeader.anticipatedDischargeDate && <div>{formatDate({ date: data?.anticipatedDischargeDate, timeZone: data?.patientTimezone }) || 'N/A'}</div>}
      
      {colId === PatientListHeader.emrSyncTime && <div>{formatDate({ date: data?.emrSyncTime, timeZone: data?.patientTimezone }) || 'N/A'}</div>}

      {colId === PatientListHeader.dischargeType && <div>{data.dischargeType}</div>}

      {colId === PatientListHeader.inPatient && <div>{data.inPatient}</div>}

      {colId === PatientListHeader.firstContactName && <div>{data.firstContactName}</div>}

      {colId === PatientListHeader.referrerName && <div>{data.referrerName}</div>}

      {colId === PatientListHeader.insuranceCompany && <div>{data.insuranceCompany}</div>}

      {colId === PatientListHeader.levelOfCare && <div>{data.levelOfCare}</div>}

      {colId === PatientListHeader.buildingName && <div>{data.buildingName}</div>}

      {colId === PatientListHeader.locationName && <div>{data.locationName}</div>}

      {colId === PatientListHeader.maidenName && <div>{data.maidenName}</div>}

      {colId === PatientListHeader.dateOfOnboarding && <div>{formatDate({ date: data?.dateOfOnboarding }) || 'N/A'}</div>}

      {colId === PatientListHeader.active && <div>{data.active}</div>}

      {colId === PatientListHeader.emergencyContact && <div>{data.emergencyContact}</div>}

      {colId === PatientListHeader.friendsAndFamily && <div>{data.friendsAndFamily}</div>}

      {colId === PatientListHeader.lastLogin && <div>{formatDate({ date: data?.lastLogin }) || 'N/A'}</div>}

      {colId === PatientListHeader.lastSyncTime && <div>{formatDate({ date: data?.lastSyncTime }) || 'N/A'}</div>}

      {colId === PatientListHeader.lastDailyReportAt && <div>{formatDate({ date: data?.lastDailyReportAt }) || 'N/A'}</div>}

      {colId === PatientListHeader.lastWeeklyReportAt && <div>{formatDate({ date: data?.lastWeeklyReportAt }) || 'N/A'}</div>}

      {colId === PatientListHeader.lastMonthlyReportAt && <div>{formatDate({ date: data?.lastMonthlyReportAt }) || 'N/A'}</div>}

      {colId === PatientListHeader.kipuVerified && <div>{formatDate({ date: data?.kipuVerified }) || 'N/A'}</div>}

      {colId === PatientListHeader.invitationStatus && <div>{data.invitationStatus}</div>}

      {colId === PatientListHeader.facilityName && <div>{data.facilityName}</div>}
    </div>
  );
}
