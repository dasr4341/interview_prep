import { TableCompatibleDataInterface, TableRow } from '../../../interface/tableCompatibledata.interface';
import { FormattedPatientDataInterface } from '../interface/ritten.interface';

export function getTableCompatibleData(rowData: TableRow[], rittenData: FormattedPatientDataInterface[]) {
  const table = {
    rows: rowData,
    cols: [
      {
        field: 'uId',
        sortable: true,
        headerName: 'uId'.toUpperCase(),
        isMultiple: false,
      },
      {
        field: 'source',
        sortable: true,
        headerName: 'source'.toUpperCase(),
        isMultiple: false,
      },
      {
        field: 'patientStatus',
        sortable: true,
        headerName: 'patientStatus'.toUpperCase(),
        isMultiple: false,
      },
      ...Object.entries(!!rittenData.length ? rittenData[0] : {}).map((k) => {
        const [key, value] = k;
        return {
          field: key,
          sortable: true,
          headerName: key.replace('_', ' ').toUpperCase(),
          isMultiple: Array.isArray(value),
        };
      }),
    ],
  };
  return table as TableCompatibleDataInterface;
}
