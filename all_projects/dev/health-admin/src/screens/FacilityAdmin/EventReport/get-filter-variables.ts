import { CareTeamTypes } from 'health-generatedTypes';
import { StoreClinicianFilterInterface } from 'interface/app.slice.interface';

export function getReportVariables(state: StoreClinicianFilterInterface) {
  return {
    all: state.filterClinicianList.length > 0 ? false : true,
    filterMonthNDate: state.filterMonthNDate.value,
    rangeStartDate: state.rangeStartDate,
    rangeEndDate: state.rangeEndDate,
    careTeamType: state.filterClinicianType?.value as CareTeamTypes || null,
    filterUsers: state.filterClinicianList.map(u => {
      return { clinicianId: u.id };
    })
  };
}
