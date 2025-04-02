export interface AnomaliesPatientListInterface {
  data: {
    firstName: string;
    lastName: string;
    type: string;
    value: number;
  }[],
  hasMore: boolean
}