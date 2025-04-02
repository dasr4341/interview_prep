import { gql } from '@apollo/client';

export const exportPatientList = gql`
  query ExportPatientList {
    pretaaHealthExportPatientList {
      fileURL
    }
  }
`;