import { KipuDataInterface } from "../../../../../../lib/kipu/interface/kipu.interface";
import { IKipuRowComparedData } from "../interface/kipu.interface";

export function getTableCompatibleData(rows:IKipuRowComparedData[], cols: KipuDataInterface | null ) {
    // formatting as per chart js -> frontend
    return {
      rows,
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
          isMultiple: false
        },
        {
          field: 'patientStatus',
          sortable: true,
          headerName: 'patientStatus'.toUpperCase(),
          isMultiple: false,
        },
        ...Object.entries(cols ?? {}).map((k) => {
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
}