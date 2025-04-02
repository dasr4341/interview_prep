export interface GetKipuDataPayload {
  startDate: string;
  endDate: string;
  facilityId: string;
  inPatient: boolean;
  discharged: boolean;
}

export interface RittenDataPayload {
  facilityId: string;
  inPatient: boolean;
  discharged: boolean;
}

export interface GetKipuDataApiResponse {
  data: {
    table: {
      rows: any;
      cols: {
        field: string;
        sortable: boolean;
        headerName: string;
        isMultiple: boolean;
      }[];
    };
    sourceSystemData: any;
  };
  message: string;
  status: boolean;
}

export interface SourceSystemFacilityList {
  name: string;
  id: string;
}
