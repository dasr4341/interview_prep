import { CarDocuments, CarProductType } from '@/generated/graphql';

export function getProductBundle(products?: CarDocuments | null) {
  const thumbnailImg =
    'https://plus.unsplash.com/premium_photo-1661544334609-6baaefe8f283?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  if (!products) {
    return [];
  }
  const bundleInspectionReportVideo = {
    name: `${CarProductType.InspectionReport} + ${CarProductType.Video}`,
    bundle: [CarProductType.InspectionReport, CarProductType.Video],
    thumbnail: thumbnailImg,
    amount:
      (products.INSPECTION_REPORT?.amount || 0) + (products.VIDEO?.amount || 0),
    documents: [
      ...(products.INSPECTION_REPORT?.data?.map((e) => ({
        title: CarProductType.InspectionReport,
        url: e.path,
      })) || []),
      ...(products.VIDEO?.data?.map((e) => ({
        title: CarProductType.Video,
        url: e.path,
      })) || []),
    ],
  };
  const serviceHistory = {
    name: CarProductType.ServiceHistory,
    bundle: [CarProductType.ServiceHistory],
    thumbnail: thumbnailImg,
    amount: products.SERVICE_HISTORY?.amount || 0,
    documents:
      products.SERVICE_HISTORY?.data?.map((e) => ({
        title: CarProductType.ServiceHistory,
        url: e.path,
      })) || [],
  };
  const bundleAll = {
    thumbnail: thumbnailImg,
    documents: [
      ...bundleInspectionReportVideo.documents,
      ...serviceHistory.documents,
    ],
    name: `${bundleInspectionReportVideo.name} + ${serviceHistory.name}`,
    bundle: [...serviceHistory.bundle, ...bundleInspectionReportVideo.bundle],
    amount: serviceHistory.amount + bundleInspectionReportVideo.amount,
  };
  return [serviceHistory, bundleInspectionReportVideo, bundleAll];
}
