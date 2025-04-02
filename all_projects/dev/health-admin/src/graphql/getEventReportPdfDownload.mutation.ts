import { gql } from '@apollo/client';

export const getEventReportPdfDownload = gql`
  mutation PretaaHealthDownloadReportPdf($eventId: String!) {
  pretaaHealthDownloadReportPdf(eventId: $eventId)
}
`;