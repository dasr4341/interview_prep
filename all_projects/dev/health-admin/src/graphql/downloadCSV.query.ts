import { gql } from "@apollo/client";

export const downloadCSVFile = gql`
query DownloadASampleCsv {
  pretaaHealthDownloadASampleCsv {
    fileURL
  }
}`;