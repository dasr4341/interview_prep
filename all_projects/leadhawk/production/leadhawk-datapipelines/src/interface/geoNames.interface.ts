export interface IGeoNames {
  totalResultsCount: number;
  geonames: Array<{
    adminCode1: string;
    lng: string;
    geonameId: number;
    toponymName: string;
    countryId: string;
    fcl: string;
    population: number;
    countryCode: string;
    name: string;
    fclName: string;
    countryName: string;
    fcodeName: string;
    adminName1: string;
    lat: string;
    fcode: string;
  }>;
}
