/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any };
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any };
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any };
};

export type Admin = {
  __typename?: 'Admin';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
};

export type AdminDetail = {
  __typename?: 'AdminDetail';
  email: Scalars['String']['output'];
  firstName: Scalars['String']['output'];
  lastName: Scalars['String']['output'];
};

export enum AdminLeadFilter {
  CarId = 'carId',
  CompanyName = 'companyName',
  ContactId = 'contactId',
  CreatedAt = 'createdAt',
  Email = 'email',
  FirstName = 'firstName',
  FuelType = 'fuelType',
  Id = 'id',
  IsEmailConfirmed = 'isEmailConfirmed',
  IsPhoneNumberConfirmed = 'isPhoneNumberConfirmed',
  LastName = 'lastName',
  LaunchYear = 'launchYear',
  LeadType = 'leadType',
  Location = 'location',
  Model = 'model',
  NoOfOwners = 'noOfOwners',
  PhoneNumber = 'phoneNumber',
  ProfileImage = 'profileImage',
  RegistrationNumber = 'registrationNumber',
  Role = 'role',
  Status = 'status',
  TotalRun = 'totalRun',
  Transmission = 'transmission',
  UpdatedAt = 'updatedAt',
  UserId = 'userId',
  Variant = 'variant',
}

export type AllUsers = {
  __typename?: 'AllUsers';
  data: Array<User>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type AnalyticsReport = {
  __typename?: 'AnalyticsReport';
  leads: Array<RangeDetails>;
  productDetails: ProductsSoldDetails;
  products: Array<RangeDetails>;
  totalCarsApplied: Scalars['Float']['output'];
};

export enum Application {
  Approved = 'APPROVED',
  Disabled = 'DISABLED',
}

export type BasicCarData = {
  __typename?: 'BasicCarData';
  companyName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fuelType?: Maybe<FuelType>;
  id: Scalars['String']['output'];
  launchYear?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  noOfOwners?: Maybe<Scalars['Int']['output']>;
  registrationNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<CarStatus>;
  totalRun?: Maybe<Scalars['Int']['output']>;
  transmission?: Maybe<TransmissionType>;
  updatedAt: Scalars['DateTime']['output'];
  variant?: Maybe<Scalars['String']['output']>;
};

export type BundleCarProduct = {
  __typename?: 'BundleCarProduct';
  CarProductDocuments?: Maybe<Array<CarProductDocuments>>;
  amount: Scalars['Float']['output'];
  createdAt: Scalars['DateTime']['output'];
  fileType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  productType: ProductType;
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type BundledItems = {
  __typename?: 'BundledItems';
  CarProduct: BundleCarProduct;
};

export type Car = {
  __typename?: 'Car';
  companyName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fuelType?: Maybe<FuelType>;
  gallery?: Maybe<Array<CarGallery>>;
  id: Scalars['String']['output'];
  launchYear?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  noOfOwners?: Maybe<Scalars['Int']['output']>;
  products?: Maybe<Array<CarProduct>>;
  quotation?: Maybe<Array<Quotation>>;
  registrationNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<CarStatus>;
  totalRun?: Maybe<Scalars['Int']['output']>;
  transmission?: Maybe<TransmissionType>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  variant?: Maybe<Scalars['String']['output']>;
};

export type CarAnalytics = {
  __typename?: 'CarAnalytics';
  productDetails: ProductsSold;
  quotationDetails: QuotationsSold;
  totalLeadCount: Scalars['Float']['output'];
  totalLeadsInRange: Array<RangeObject>;
  totalProductSoldInRange: Array<RangeObject>;
  totalViewCount: Scalars['Float']['output'];
  totalViewsInRange: Array<RangeObject>;
};

export type CarAnalyticsResponse = {
  __typename?: 'CarAnalyticsResponse';
  data: CarAnalytics;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type CarApproveStatus = {
  __typename?: 'CarApproveStatus';
  approveStatus: Scalars['Boolean']['output'];
  requiredData: RequiredData;
};

export type CarBundle = {
  __typename?: 'CarBundle';
  amount: Scalars['Float']['output'];
  bundledItems: Array<BundledItems>;
  fileType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
};

export type CarDoc = {
  __typename?: 'CarDoc';
  documentType: Scalars['String']['output'];
  fileName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type CarGallery = {
  __typename?: 'CarGallery';
  createdAt?: Maybe<Scalars['String']['output']>;
  documents: Array<CarDoc>;
  fileType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CarGalleryDoc = {
  __typename?: 'CarGalleryDoc';
  CarGalleryDocuments?: Maybe<Array<CarDoc>>;
  createdAt?: Maybe<Scalars['String']['output']>;
  fileType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CarInLead = {
  __typename?: 'CarInLead';
  carGallery?: Maybe<Array<CarGalleryDoc>>;
  companyName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fuelType?: Maybe<FuelType>;
  id: Scalars['String']['output'];
  launchYear?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  noOfOwners?: Maybe<Scalars['Int']['output']>;
  products?: Maybe<Array<CarProduct>>;
  quotation?: Maybe<Array<Quotation>>;
  registrationNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<CarStatus>;
  totalRun?: Maybe<Scalars['Int']['output']>;
  transmission?: Maybe<TransmissionType>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  variant?: Maybe<Scalars['String']['output']>;
};

export type CarProduct = {
  __typename?: 'CarProduct';
  amount: Scalars['Float']['output'];
  createdAt?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Currency>;
  discountedAmount?: Maybe<Scalars['Float']['output']>;
  documents?: Maybe<Array<CarDoc>>;
  fileType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  productType: ProductType;
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type CarProductDocuments = {
  __typename?: 'CarProductDocuments';
  documentType: DocumentTypeDocumentType;
  fileName: Scalars['String']['output'];
  path: Scalars['String']['output'];
};

export type CarProductInLeadModel = {
  __typename?: 'CarProductInLeadModel';
  fileType: Scalars['String']['output'];
  id: Scalars['String']['output'];
  productType: ProductType;
};

export type CarSingleView = {
  __typename?: 'CarSingleView';
  ipAddress: Scalars['String']['output'];
  latestViewedAt: Scalars['DateTime']['output'];
  user?: Maybe<CarViewerUser>;
  userAgent: Scalars['String']['output'];
  userId?: Maybe<Scalars['String']['output']>;
  viewsCount: Scalars['Float']['output'];
};

export enum CarStatus {
  Approved = 'APPROVED',
  Disabled = 'DISABLED',
  Pending = 'PENDING',
  Sold = 'SOLD',
}

export enum CarTableFilter {
  CompanyName = 'companyName',
  CreatedAt = 'createdAt',
  Email = 'email',
  FirstName = 'firstName',
  FuelType = 'fuelType',
  Id = 'id',
  IsEmailConfirmed = 'isEmailConfirmed',
  IsPhoneNumberConfirmed = 'isPhoneNumberConfirmed',
  LastName = 'lastName',
  LaunchYear = 'launchYear',
  Location = 'location',
  Model = 'model',
  NoOfOwners = 'noOfOwners',
  PhoneNumber = 'phoneNumber',
  ProfileImage = 'profileImage',
  RegistrationNumber = 'registrationNumber',
  Role = 'role',
  Status = 'status',
  TotalRun = 'totalRun',
  Transmission = 'transmission',
  UpdatedAt = 'updatedAt',
  UserId = 'userId',
  Variant = 'variant',
}

export type CarVariant = {
  __typename?: 'CarVariant';
  fuelType: FuelType;
  transmissionType: TransmissionType;
  variantName: Scalars['String']['output'];
};

export type CarViewerUser = {
  __typename?: 'CarViewerUser';
  firstName?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
};

export type CarViewers = {
  __typename?: 'CarViewers';
  data?: Maybe<Array<CarSingleView>>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type CarsAnalytics = {
  __typename?: 'CarsAnalytics';
  totalCarsApproved: Scalars['Int']['output'];
  totalCarsDisabled: Scalars['Int']['output'];
  totalCarsPending: Scalars['Int']['output'];
  totalCarsPosted: Scalars['Int']['output'];
};

export type CarsCount = {
  __typename?: 'CarsCount';
  inPast7DaysApprovedCars: Scalars['Float']['output'];
  inPast7DaysSoldCars: Scalars['Float']['output'];
  totalApprovedCars: Scalars['Float']['output'];
  totalCars: Scalars['Float']['output'];
  totalDisabledCars: Scalars['Float']['output'];
  totalPendingCars: Scalars['Float']['output'];
  totalSoldCars: Scalars['Float']['output'];
};

export type CarsFilterInput = {
  column: CarTableFilter;
  operator: Scalars['String']['input'];
  type: TableColumnType;
  value?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type ContactDataDto = {
  alternateEmail?: InputMaybe<Scalars['String']['input']>;
  alternatePhone?: InputMaybe<Scalars['String']['input']>;
  carId: Scalars['String']['input'];
  message: Scalars['String']['input'];
};

export type ContactFormRegisterInput = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

export type ContactMessage = {
  __typename?: 'ContactMessage';
  createdAt: Scalars['DateTime']['output'];
  message: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ContactsData = {
  __typename?: 'ContactsData';
  alternateEmail?: Maybe<Scalars['String']['output']>;
  alternatePhone?: Maybe<Scalars['String']['output']>;
  carId: Scalars['String']['output'];
  contactMessage?: Maybe<Array<ContactMessage>>;
  id: Scalars['String']['output'];
};

export type ContactsDataInQuoteModel = {
  __typename?: 'ContactsDataInQuoteModel';
  alternateEmail?: Maybe<Scalars['String']['output']>;
  alternatePhone?: Maybe<Scalars['String']['output']>;
  car: BasicCarData;
  contactMessage?: Maybe<Array<ContactMessage>>;
  id: Scalars['String']['output'];
};

export type CreateCarInput = {
  companyName: Scalars['String']['input'];
  fuelType: FuelType;
  launchYear: Scalars['Int']['input'];
  model: Scalars['String']['input'];
  noOfOwners: Scalars['Int']['input'];
  registrationNumber: Scalars['String']['input'];
  totalRun: Scalars['Int']['input'];
  transmission: TransmissionType;
  variant: Scalars['String']['input'];
};

export enum Currency {
  Inr = 'INR',
}

export enum DashboardReportType {
  CarListing = 'CAR_LISTING',
  LeadsListing = 'LEADS_LISTING',
  SoldCars = 'SOLD_CARS',
  Visitors = 'VISITORS',
}

export type Data = {
  __typename?: 'Data';
  paymentId: Scalars['String']['output'];
};

export type DealerAnalyticsDto = {
  dealerId: Scalars['String']['input'];
  lead?: InputMaybe<DealerRange>;
  quotation?: InputMaybe<DealerRange>;
};

export type DealerAnalyticsReport = {
  __typename?: 'DealerAnalyticsReport';
  cars?: Maybe<CarsAnalytics>;
  leads?: Maybe<LeadDetails>;
  quotations?: Maybe<QuotationsDetails>;
};

export type DealerAnalyticsResponse = {
  __typename?: 'DealerAnalyticsResponse';
  data: DealerAnalyticsReport;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type DealerCarDetails = {
  __typename?: 'DealerCarDetails';
  companyName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fuelType?: Maybe<FuelType>;
  gallery?: Maybe<Array<CarGallery>>;
  id: Scalars['String']['output'];
  launchYear?: Maybe<Scalars['Int']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  noOfOwners?: Maybe<Scalars['Int']['output']>;
  quotation?: Maybe<Array<Quotation>>;
  registrationNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<CarStatus>;
  totalRun?: Maybe<Scalars['Int']['output']>;
  transmission?: Maybe<TransmissionType>;
  updatedAt: Scalars['DateTime']['output'];
  variant?: Maybe<Scalars['String']['output']>;
};

export type DealerDetails = {
  __typename?: 'DealerDetails';
  companyName?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<DealerDocuments>>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Status>;
  totalActiveQuotation?: Maybe<Scalars['Float']['output']>;
  totalCars?: Maybe<Scalars['Float']['output']>;
  totalPendingQuotation?: Maybe<Scalars['Float']['output']>;
};

export type DealerDocuments = {
  __typename?: 'DealerDocuments';
  docs?: Maybe<Array<Doc>>;
  fileType?: Maybe<Scalars['String']['output']>;
};

export type DealerLead = {
  __typename?: 'DealerLead';
  id: Scalars['String']['output'];
  leadId?: Maybe<Scalars['String']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  seen?: Maybe<Scalars['Boolean']['output']>;
};

export enum DealerLeadFilter {
  CarId = 'carId',
  CompanyName = 'companyName',
  ContactId = 'contactId',
  CreatedAt = 'createdAt',
  DealerId = 'dealerId',
  FuelType = 'fuelType',
  Id = 'id',
  LaunchYear = 'launchYear',
  LeadId = 'leadId',
  LeadType = 'leadType',
  Model = 'model',
  NoOfOwners = 'noOfOwners',
  Note = 'note',
  RegistrationNumber = 'registrationNumber',
  Seen = 'seen',
  Status = 'status',
  TotalRun = 'totalRun',
  Transmission = 'transmission',
  UpdatedAt = 'updatedAt',
  UserId = 'userId',
  Variant = 'variant',
}

export type DealerLeadFilterInput = {
  column: DealerLeadFilter;
  operator: Scalars['String']['input'];
  type: TableColumnType;
  value?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type DealerLeads = {
  __typename?: 'DealerLeads';
  dealerId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  lead: LeadDetail;
  note?: Maybe<Scalars['String']['output']>;
  seen: Scalars['Boolean']['output'];
};

export type DealerLeadsResponse = {
  __typename?: 'DealerLeadsResponse';
  leads?: Maybe<Array<DealerLeads>>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type DealerQuotation = {
  __typename?: 'DealerQuotation';
  adminDetail?: Maybe<AdminDetail>;
  car?: Maybe<Car>;
  carId: Scalars['String']['output'];
  id: Scalars['String']['output'];
  quotationDetails: QuotationDetail;
  status: QuotationStatus;
};

export type DealerRange = {
  end?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
};

export type DealerRangeObject = {
  __typename?: 'DealerRangeObject';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum DeleteDocType {
  CarGallery = 'CAR_GALLERY',
  Dealer = 'DEALER',
}

export type Doc = {
  __typename?: 'Doc';
  amount?: Maybe<Scalars['Float']['output']>;
  createdAt?: Maybe<Scalars['String']['output']>;
  currency?: Maybe<Currency>;
  fileName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  path?: Maybe<Scalars['String']['output']>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export enum DocumentTypeDocumentType {
  Document = 'DOCUMENT',
  Image = 'IMAGE',
  Video = 'VIDEO',
}

export type DropdownCompanies = {
  __typename?: 'DropdownCompanies';
  companies?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type DropdownModels = {
  __typename?: 'DropdownModels';
  message: Scalars['String']['output'];
  modelNames?: Maybe<Array<Scalars['String']['output']>>;
  success: Scalars['Boolean']['output'];
};

export type DropdownVariant = {
  __typename?: 'DropdownVariant';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  variant?: Maybe<Array<CarVariant>>;
};

export type DropdownYear = {
  __typename?: 'DropdownYear';
  manufacturingYears?: Maybe<Array<Scalars['String']['output']>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type EndUser = {
  __typename?: 'EndUser';
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
};

/** File Upload Types */
export enum FileType {
  Documents = 'DOCUMENTS',
  Images = 'IMAGES',
  ProfileImage = 'PROFILE_IMAGE',
}

export type FilterOperators = {
  __typename?: 'FilterOperators';
  data: Scalars['JSONObject']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type ForgetPasswordResponse = {
  __typename?: 'ForgetPasswordResponse';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export enum FuelType {
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid',
  Petrol = 'Petrol',
}

export type FuelWithTransmission = {
  __typename?: 'FuelWithTransmission';
  fuelTransmissionGroup?: Maybe<Scalars['JSONObject']['output']>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetAllCarsAdmin = {
  __typename?: 'GetAllCarsAdmin';
  data: Array<Car>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type GetAllCarsDealer = {
  __typename?: 'GetAllCarsDealer';
  data: Array<DealerCarDetails>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type GetAllCarsUser = {
  __typename?: 'GetAllCarsUser';
  data: Array<UserCarDetails>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type GetCarApproveStatus = {
  __typename?: 'GetCarApproveStatus';
  data: CarApproveStatus;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetCarBundle = {
  __typename?: 'GetCarBundle';
  data?: Maybe<CarBundle>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetCarBundles = {
  __typename?: 'GetCarBundles';
  data?: Maybe<Array<CarBundle>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetCarDetailAdmin = {
  __typename?: 'GetCarDetailAdmin';
  data: Car;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetCarDetailDealer = {
  __typename?: 'GetCarDetailDealer';
  data: DealerCarDetails;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetCarDetailUser = {
  __typename?: 'GetCarDetailUser';
  data: UserCarDetails;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetContactsData = {
  __typename?: 'GetContactsData';
  data: Array<ContactsDataInQuoteModel>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type GetDealerDetails = {
  __typename?: 'GetDealerDetails';
  data?: Maybe<DealerDetails>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetDealerQuotation = {
  __typename?: 'GetDealerQuotation';
  dealerQuotationDetails?: Maybe<DealerQuotation>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type GetDealerQuotations = {
  __typename?: 'GetDealerQuotations';
  key: Scalars['String']['output'];
  quotations: Array<DealerQuotation>;
};

export type GetStatsCountModel = {
  __typename?: 'GetStatsCountModel';
  cars: CarsCount;
  inPast7DaysVisitors: Scalars['Float']['output'];
  leads: LeadsCount;
  totalCustomers: Scalars['Float']['output'];
  totalDealers: Scalars['Float']['output'];
  totalVisitors: Scalars['Float']['output'];
};

export type GetStatsCountResponseModel = {
  __typename?: 'GetStatsCountResponseModel';
  data: GetStatsCountModel;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type InvoiceRecord = {
  __typename?: 'InvoiceRecord';
  amount: Scalars['Float']['output'];
  amountDue: Scalars['Float']['output'];
  amountPaid: Scalars['Float']['output'];
  bundleDetails?: Maybe<CarProduct>;
  carDetail?: Maybe<Scalars['String']['output']>;
  carId?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  invoiceStatus: Scalars['String']['output'];
  productsPurchased?: Maybe<Array<CarProduct>>;
  quotation?: Maybe<PaymentQuotationDetails>;
  quotationId?: Maybe<Scalars['String']['output']>;
  razorpayOrderId: Scalars['String']['output'];
  razorpayPaymentId?: Maybe<Scalars['String']['output']>;
  receipt?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId?: Maybe<Scalars['String']['output']>;
  userName: Scalars['String']['output'];
  userRole: Roles;
};

export type Lead = {
  __typename?: 'Lead';
  activeQuotation: Scalars['Boolean']['output'];
  assigned?: Maybe<Scalars['Boolean']['output']>;
  callCount?: Maybe<Scalars['Float']['output']>;
  car?: Maybe<CarInLead>;
  carId: Scalars['String']['output'];
  contact?: Maybe<ContactsData>;
  id: Scalars['String']['output'];
  leadType: LeadType;
  status: LeadsStatus;
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
};

export type LeadDetail = {
  __typename?: 'LeadDetail';
  car: Car;
  contact?: Maybe<ContactsData>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  leadType: LeadType;
  purchasedProducts: Array<PurchasedProduct>;
  status: LeadsStatus;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
};

export type LeadDetails = {
  __typename?: 'LeadDetails';
  assignedLeads?: Maybe<Array<YearlyLeads>>;
  totalAssignedLeadsCount?: Maybe<Scalars['Float']['output']>;
  totalLeadsInRange?: Maybe<Array<DealerRangeObject>>;
  totalUnAssignedLeadsCount?: Maybe<Scalars['Float']['output']>;
};

export type LeadFilterInput = {
  column: AdminLeadFilter;
  operator: Scalars['String']['input'];
  type: TableColumnType;
  value?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type LeadModel = {
  __typename?: 'LeadModel';
  data: Array<Lead>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export enum LeadType {
  HotLead = 'HOT_LEAD',
  Lead = 'LEAD',
}

export type LeadsCount = {
  __typename?: 'LeadsCount';
  inPast7DaysLeads: Scalars['Float']['output'];
  totalColdAssignedLeads: Scalars['Float']['output'];
  totalColdUnassignedLeads: Scalars['Float']['output'];
  totalHotAssignedLeads: Scalars['Float']['output'];
  totalHotUnassignedLeads: Scalars['Float']['output'];
  totalLeads: Scalars['Float']['output'];
};

export enum LeadsStatus {
  Assigned = 'ASSIGNED',
  Unassigned = 'UNASSIGNED',
}

export type ModifiedGetDealerQuotations = {
  __typename?: 'ModifiedGetDealerQuotations';
  data: Array<GetDealerQuotations>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type MonthlyLeads = {
  __typename?: 'MonthlyLeads';
  data: Array<DealerLead>;
  month: Scalars['String']['output'];
  totalMonthlyLeads: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** In case admin has forgot the password. */
  adminForgetPassword: Response;
  adminForgetPasswordEmailVerification: ForgetPasswordResponse;
  /** A admin user can login using this endpoint */
  adminLogin: SignInResponse;
  adminResetPassword: Response;
  adminSetForgetPassword: Response;
  assignLeadsToDealer: UnassignedLeadModel;
  contactFormSubmit: Response;
  createCar: Response;
  createOrder: RazorpayOrderApp;
  createOrderForEndUser: RazorpayOrderWeb;
  customerLoginWithPhoneOtp: Response;
  deleteBundle: Response;
  deleteGalleryOrDealerDocument: Response;
  deleteProduct: Response;
  deleteUserProfileImage: Response;
  getNewTokens: Token;
  loginWithPhoneOtp: Response;
  makeBundle: Response;
  raiseQuotation: Response;
  registerDealerWithPhoneNumberViaOtp: Response;
  registerUser: Response;
  sendEmailOtp: Response;
  storeDealerAnalyticsData: Response;
  updateAdminDetails: Admin;
  updateCarStatus: Response;
  updateDealer: UpdateDealer;
  updateDealerNote: Response;
  updateDealerStatus: Response;
  updateEndUserDetail: UpdateEndUser;
  updateLeadSeenStatus: Response;
  uploadCarGalleryDocuments: Response;
  uploadCarProducts: Response;
  uploadThumbnail: Response;
  uploadUserDocument: Response;
  verifyEmailOtp: Response;
  verifyLoginPhoneOtp: VerifyRegistrationWithPhoneNumber;
  verifyRazorpayPayment: PaymentVerification;
  verifyRazorpayPaymentForEndUser: UserPaymentVerification;
};

export type MutationAdminForgetPasswordArgs = {
  email: Scalars['String']['input'];
};

export type MutationAdminForgetPasswordEmailVerificationArgs = {
  token: Scalars['String']['input'];
};

export type MutationAdminLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MutationAdminResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  oldPassword: Scalars['String']['input'];
};

export type MutationAdminSetForgetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['String']['input'];
};

export type MutationAssignLeadsToDealerArgs = {
  leads: Array<Scalars['String']['input']>;
};

export type MutationContactFormSubmitArgs = {
  formData: ContactDataDto;
  registerInput?: InputMaybe<ContactFormRegisterInput>;
};

export type MutationCreateCarArgs = {
  createCarInput: CreateCarInput;
};

export type MutationCreateOrderArgs = {
  QuotationId: Scalars['String']['input'];
};

export type MutationCreateOrderForEndUserArgs = {
  bundleId?: InputMaybe<Scalars['String']['input']>;
  carId: Scalars['String']['input'];
  products?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type MutationCustomerLoginWithPhoneOtpArgs = {
  phoneNumber: Scalars['String']['input'];
};

export type MutationDeleteBundleArgs = {
  bundleId: Scalars['String']['input'];
};

export type MutationDeleteGalleryOrDealerDocumentArgs = {
  docType: DeleteDocType;
  documentId: Scalars['String']['input'];
};

export type MutationDeleteProductArgs = {
  productIds: Array<Scalars['String']['input']>;
};

export type MutationGetNewTokensArgs = {
  refreshToken: Scalars['String']['input'];
};

export type MutationLoginWithPhoneOtpArgs = {
  phoneNumber: Scalars['String']['input'];
};

export type MutationMakeBundleArgs = {
  amount: Scalars['Int']['input'];
  carId: Scalars['String']['input'];
  discountedAmount?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']>;
};

export type MutationRaiseQuotationArgs = {
  amount: Scalars['Float']['input'];
  carId: Scalars['String']['input'];
  noOfLeads: Scalars['Float']['input'];
  validityDays: Scalars['Float']['input'];
};

export type MutationRegisterDealerWithPhoneNumberViaOtpArgs = {
  phoneNumber: Scalars['String']['input'];
};

export type MutationRegisterUserArgs = {
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  phoneNumber: Scalars['String']['input'];
};

export type MutationSendEmailOtpArgs = {
  email: Scalars['String']['input'];
};

export type MutationStoreDealerAnalyticsDataArgs = {
  customerId: Scalars['String']['input'];
  dealerLeadId: Scalars['String']['input'];
};

export type MutationUpdateAdminDetailsArgs = {
  firstName: Scalars['String']['input'];
  lastName: Scalars['String']['input'];
};

export type MutationUpdateCarStatusArgs = {
  cartData: UpdateCarStatus;
};

export type MutationUpdateDealerArgs = {
  companyName?: InputMaybe<Scalars['String']['input']>;
  dealerId?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<Scalars['Upload']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateDealerNoteArgs = {
  leadId: Scalars['String']['input'];
  note: Scalars['String']['input'];
};

export type MutationUpdateDealerStatusArgs = {
  id: Scalars['String']['input'];
  status: Application;
};

export type MutationUpdateEndUserDetailArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  file?: InputMaybe<Scalars['Upload']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUpdateLeadSeenStatusArgs = {
  isSeenAll?: InputMaybe<Scalars['Boolean']['input']>;
  leadIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type MutationUploadCarGalleryDocumentsArgs = {
  carId: Scalars['String']['input'];
  documentType: DocumentTypeDocumentType;
  fileType: Scalars['String']['input'];
  files: Array<Scalars['Upload']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isThumbnail: Scalars['Boolean']['input'];
};

export type MutationUploadCarProductsArgs = {
  amount: Scalars['Float']['input'];
  carId: Scalars['String']['input'];
  discountedAmount?: InputMaybe<Scalars['Float']['input']>;
  documentType: DocumentTypeDocumentType;
  fileType: Scalars['String']['input'];
  files: Array<Scalars['Upload']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
};

export type MutationUploadThumbnailArgs = {
  documentId: Scalars['String']['input'];
  documentType: DocumentTypeDocumentType;
  files: Scalars['Upload']['input'];
};

export type MutationUploadUserDocumentArgs = {
  dealerId: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  files: Array<Scalars['Upload']['input']>;
  uploadCategory: FileType;
};

export type MutationVerifyEmailOtpArgs = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type MutationVerifyLoginPhoneOtpArgs = {
  otp: Scalars['String']['input'];
  phoneNumber: Scalars['String']['input'];
};

export type MutationVerifyRazorpayPaymentArgs = {
  razorpayOrderId: Scalars['String']['input'];
  razorpayPaymentId: Scalars['String']['input'];
  razorpaySignature: Scalars['String']['input'];
};

export type MutationVerifyRazorpayPaymentForEndUserArgs = {
  razorpayOrderId: Scalars['String']['input'];
  razorpayPaymentId: Scalars['String']['input'];
  razorpaySignature: Scalars['String']['input'];
};

export type Order = {
  __typename?: 'Order';
  amount: Scalars['Float']['output'];
  amount_due?: Maybe<Scalars['Float']['output']>;
  amount_paid?: Maybe<Scalars['Float']['output']>;
  attempts?: Maybe<Scalars['String']['output']>;
  currency: Scalars['String']['output'];
  id: Scalars['String']['output'];
  order_id: Scalars['String']['output'];
  prefill: Prefill;
  receipt?: Maybe<Scalars['String']['output']>;
};

export type OrderDetails = {
  __typename?: 'OrderDetails';
  amount: Scalars['String']['output'];
  currency: Scalars['String']['output'];
  description: Scalars['String']['output'];
  entity: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
  order_id: Scalars['String']['output'];
  prefill: Prefill;
  theme: Theme;
};

export type Pagination = {
  __typename?: 'Pagination';
  currentPage: Scalars['Float']['output'];
  limit: Scalars['Float']['output'];
  maxPage: Scalars['Float']['output'];
  total: Scalars['Float']['output'];
};

export type PaymentQuotationDetails = {
  __typename?: 'PaymentQuotationDetails';
  car: QuotationCarDetails;
};

export type PaymentVerification = {
  __typename?: 'PaymentVerification';
  carId: Scalars['String']['output'];
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type Prefill = {
  __typename?: 'Prefill';
  contact: Scalars['String']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export enum ProductType {
  Bundle = 'BUNDLE',
  Product = 'PRODUCT',
}

export type ProductsSold = {
  __typename?: 'ProductsSold';
  sales: Array<SalesDetails>;
  totalProductsSoldCount: Scalars['Float']['output'];
  totalRevenue: Scalars['Float']['output'];
};

export type ProductsSoldDetails = {
  __typename?: 'ProductsSoldDetails';
  sales: Array<SalesDetails>;
  totalPaid: Scalars['Float']['output'];
};

export type PurchasedProduct = {
  __typename?: 'PurchasedProduct';
  carProduct: CarProductInLeadModel;
};

export type Query = {
  __typename?: 'Query';
  checkCarApproveStatus: GetCarApproveStatus;
  checkCarRegistrationNumber: Response;
  checkDealerApproveStatus: Scalars['Boolean']['output'];
  checkPhoneNumber: Response;
  /** Get admin details using this endpoint (protected route) */
  getAdminDetails: Admin;
  getAdminLeads: LeadModel;
  getAllCustomers: AllUsers;
  getCarAnalyticsReport: CarAnalyticsResponse;
  getCarBundle: GetCarBundle;
  getCarBundles: GetCarBundles;
  getCarDetailAdmin: GetCarDetailAdmin;
  getCarDetailDealer: GetCarDetailDealer;
  getCarDetailUser: GetCarDetailUser;
  getCarListViewedByUser: GetAllCarsAdmin;
  getCarViewers: CarViewers;
  getCarsAdmin: GetAllCarsAdmin;
  getCarsDealer: GetAllCarsDealer;
  getCarsUser: GetAllCarsUser;
  getCompanyList: DropdownCompanies;
  getContactData: GetContactsData;
  getContactDataAdmin: GetContactsData;
  getCustomersDetails: UserDetails;
  getDealerAnalytics: DealerAnalyticsResponse;
  getDealerLeads: DealerLeadsResponse;
  getDealerQuotations: ModifiedGetDealerQuotations;
  getFilteredOperator: FilterOperators;
  getFuelWithTransmissionType: FuelWithTransmission;
  getManufacturingYear: DropdownYear;
  getModelNamesForYear: DropdownModels;
  getPaymentHistory: UserPaymentLog;
  getPaymentHistoryList: UserPaymentLogs;
  getQuotationDetail: GetDealerQuotation;
  getReportByDateRangeDashboard: ReportDataModel;
  getStatsCountsDashboard: GetStatsCountResponseModel;
  getUserDetails: User;
  getVariantForModel: DropdownVariant;
  userAnalytics: UserAnalyticsReport;
  verifyToken: Response;
  viewAllDealers: ViewAllDealers;
  viewDealer: GetDealerDetails;
};

export type QueryCheckCarApproveStatusArgs = {
  carId: Scalars['String']['input'];
};

export type QueryCheckCarRegistrationNumberArgs = {
  registrationNumber: Scalars['String']['input'];
};

export type QueryCheckDealerApproveStatusArgs = {
  dealerId: Scalars['String']['input'];
};

export type QueryCheckPhoneNumberArgs = {
  phoneNumber: Scalars['String']['input'];
};

export type QueryGetAdminLeadsArgs = {
  filter?: InputMaybe<Array<LeadFilterInput>>;
  leadId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryGetAllCustomersArgs = {
  filter?: InputMaybe<Array<UserFilterInput>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryGetCarAnalyticsReportArgs = {
  carId: Scalars['String']['input'];
  lead?: InputMaybe<Range>;
  product?: InputMaybe<Range>;
  views?: InputMaybe<Range>;
};

export type QueryGetCarBundleArgs = {
  bundleId: Scalars['String']['input'];
  carId: Scalars['String']['input'];
};

export type QueryGetCarBundlesArgs = {
  carId: Scalars['String']['input'];
};

export type QueryGetCarDetailAdminArgs = {
  carId: Scalars['String']['input'];
};

export type QueryGetCarDetailDealerArgs = {
  carId: Scalars['String']['input'];
};

export type QueryGetCarDetailUserArgs = {
  carId: Scalars['String']['input'];
};

export type QueryGetCarListViewedByUserArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  userId: Scalars['String']['input'];
};

export type QueryGetCarViewersArgs = {
  carId: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryGetCarsAdminArgs = {
  filter?: InputMaybe<Array<CarsFilterInput>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  suggestedColumn?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetCarsDealerArgs = {
  filter?: InputMaybe<Array<CarsFilterInput>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  suggestedColumn?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetCarsUserArgs = {
  filter?: InputMaybe<Array<CarsFilterInput>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  suggestedColumn?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetContactDataArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryGetContactDataAdminArgs = {
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetCustomersDetailsArgs = {
  userId: Scalars['String']['input'];
};

export type QueryGetDealerAnalyticsArgs = {
  input?: InputMaybe<DealerAnalyticsDto>;
};

export type QueryGetDealerLeadsArgs = {
  filter?: InputMaybe<Array<DealerLeadFilterInput>>;
  leadId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryGetDealerQuotationsArgs = {
  carId?: InputMaybe<Scalars['String']['input']>;
  dealerId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryGetFilteredOperatorArgs = {
  columnType: TableColumnType;
};

export type QueryGetFuelWithTransmissionTypeArgs = {
  companyName: Scalars['String']['input'];
  model: Scalars['String']['input'];
  year: Scalars['String']['input'];
};

export type QueryGetManufacturingYearArgs = {
  companyName: Scalars['String']['input'];
};

export type QueryGetModelNamesForYearArgs = {
  companyName: Scalars['String']['input'];
  year: Scalars['String']['input'];
};

export type QueryGetPaymentHistoryArgs = {
  paymentId: Scalars['String']['input'];
};

export type QueryGetPaymentHistoryListArgs = {
  filter?: InputMaybe<Array<UserInvoiceFilterInput>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetQuotationDetailArgs = {
  dealerId?: InputMaybe<Scalars['String']['input']>;
  quotationId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetReportByDateRangeDashboardArgs = {
  endDate: Scalars['DateTime']['input'];
  startDate: Scalars['DateTime']['input'];
  type: DashboardReportType;
};

export type QueryGetUserDetailsArgs = {
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryGetVariantForModelArgs = {
  company: Scalars['String']['input'];
  fuelType: FuelType;
  model: Scalars['String']['input'];
  transmissionType: TransmissionType;
  year: Scalars['String']['input'];
};

export type QueryUserAnalyticsArgs = {
  leadRange?: InputMaybe<UserInputRange>;
  productPurchasedRange?: InputMaybe<UserInputRange>;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type QueryViewAllDealersArgs = {
  dealerFilter?: InputMaybe<Array<UserFilterInput>>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
};

export type QueryViewDealerArgs = {
  dealerId: Scalars['String']['input'];
};

export type Quotation = {
  __typename?: 'Quotation';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  quotationDetails?: Maybe<QuotationDetail>;
  status: QuotationStatus;
};

export type QuotationCarDetails = {
  __typename?: 'QuotationCarDetails';
  registrationNumber: Scalars['String']['output'];
};

export type QuotationDetail = {
  __typename?: 'QuotationDetail';
  amount: Scalars['Float']['output'];
  currency: Scalars['String']['output'];
  expiryDate?: Maybe<Scalars['DateTime']['output']>;
  noOfLeads: Scalars['Float']['output'];
  startDate?: Maybe<Scalars['DateTime']['output']>;
  validityDays: Scalars['Float']['output'];
};

export enum QuotationStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Expired = 'EXPIRED',
  Paid = 'PAID',
  Pending = 'PENDING',
}

export type QuotationsDetails = {
  __typename?: 'QuotationsDetails';
  activeQuotations?: Maybe<Scalars['Float']['output']>;
  cancelQuotations?: Maybe<Scalars['Float']['output']>;
  expiredQuotations?: Maybe<Scalars['Float']['output']>;
  paidQuotations?: Maybe<Scalars['Float']['output']>;
  pendingQuotations?: Maybe<Scalars['Float']['output']>;
  totalActiveQuotationsInRange?: Maybe<Array<DealerRangeObject>>;
  totalCancelQuotationsInRange?: Maybe<Array<DealerRangeObject>>;
  totalExpireQuotationsInRange?: Maybe<Array<DealerRangeObject>>;
  totalPaidQuotationsInRange?: Maybe<Array<DealerRangeObject>>;
  totalPendingQuotationsInRange?: Maybe<Array<DealerRangeObject>>;
};

export type QuotationsSold = {
  __typename?: 'QuotationsSold';
  totalActiveQuotationCount: Scalars['Float']['output'];
  totalCancelledQuotationCount: Scalars['Float']['output'];
  totalExpiredQuotationCount: Scalars['Float']['output'];
  totalPendingQuotationCount: Scalars['Float']['output'];
};

export type Range = {
  end?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
};

export type RangeDetails = {
  __typename?: 'RangeDetails';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RangeObject = {
  __typename?: 'RangeObject';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type RazorpayOrderApp = {
  __typename?: 'RazorpayOrderApp';
  message: Scalars['String']['output'];
  order: Order;
  success: Scalars['Boolean']['output'];
};

export type RazorpayOrderWeb = {
  __typename?: 'RazorpayOrderWeb';
  message: Scalars['String']['output'];
  order: OrderDetails;
  success: Scalars['Boolean']['output'];
};

export type ReportData = {
  __typename?: 'ReportData';
  count: Scalars['Float']['output'];
  key: Scalars['String']['output'];
};

export type ReportDataModel = {
  __typename?: 'ReportDataModel';
  data: Array<ReportData>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type RequiredData = {
  __typename?: 'RequiredData';
  isCarImageExist: Scalars['Boolean']['output'];
  isCarProductExist: Scalars['Boolean']['output'];
  isCarVideoExist: Scalars['Boolean']['output'];
  isQuotationExist: Scalars['Boolean']['output'];
  isQuotationPaid: Scalars['Boolean']['output'];
  isThumbnailExist: Scalars['Boolean']['output'];
};

export type Response = {
  __typename?: 'Response';
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export enum Roles {
  Admin = 'ADMIN',
  Dealer = 'DEALER',
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER',
}

export type SalesDetails = {
  __typename?: 'SalesDetails';
  count: Scalars['Float']['output'];
  fileType: Scalars['String']['output'];
};

export type SignInResponse = {
  __typename?: 'SignInResponse';
  message: Scalars['String']['output'];
  signInToken?: Maybe<Token>;
  success: Scalars['Boolean']['output'];
};

export enum Status {
  Approved = 'APPROVED',
  Disabled = 'DISABLED',
  Onboarded = 'ONBOARDED',
  Pending = 'PENDING',
}

export enum TableColumnType {
  Boolean = 'BOOLEAN',
  Date = 'DATE',
  Enum = 'ENUM',
  Number = 'NUMBER',
  String = 'STRING',
}

export type Theme = {
  __typename?: 'Theme';
  color: Scalars['String']['output'];
};

export type Token = {
  __typename?: 'Token';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export enum TransmissionType {
  At = 'AT',
  Mt = 'MT',
}

export type UnassignedLeadModel = {
  __typename?: 'UnassignedLeadModel';
  data?: Maybe<Array<Lead>>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateCarStatus = {
  id: Scalars['String']['input'];
  status: CarStatus;
};

export type UpdateDealer = {
  __typename?: 'UpdateDealer';
  data: User;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UpdateEndUser = {
  __typename?: 'UpdateEndUser';
  data: EndUser;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  companyName?: Maybe<Scalars['String']['output']>;
  documents?: Maybe<Array<UserDocument>>;
  email?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  lastName?: Maybe<Scalars['String']['output']>;
  location?: Maybe<Scalars['String']['output']>;
  phoneNumber?: Maybe<Scalars['String']['output']>;
  profileImage?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Status>;
};

export type UserAnalyticsReport = {
  __typename?: 'UserAnalyticsReport';
  data?: Maybe<AnalyticsReport>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UserCarDetails = {
  __typename?: 'UserCarDetails';
  companyName: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  fuelType?: Maybe<FuelType>;
  gallery?: Maybe<Array<CarGallery>>;
  id: Scalars['String']['output'];
  launchYear?: Maybe<Scalars['Int']['output']>;
  lead?: Maybe<Scalars['Boolean']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  noOfOwners?: Maybe<Scalars['Int']['output']>;
  products?: Maybe<Array<CarProduct>>;
  registrationNumber?: Maybe<Scalars['String']['output']>;
  status?: Maybe<CarStatus>;
  totalRun?: Maybe<Scalars['Int']['output']>;
  transmission?: Maybe<TransmissionType>;
  updatedAt: Scalars['DateTime']['output'];
  user?: Maybe<User>;
  userId: Scalars['String']['output'];
  variant?: Maybe<Scalars['String']['output']>;
};

export type UserDetails = {
  __typename?: 'UserDetails';
  data?: Maybe<User>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UserDocument = {
  __typename?: 'UserDocument';
  fileName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  path: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type UserFilterInput = {
  column: UserTableFilterEnum;
  operator: Scalars['String']['input'];
  type: TableColumnType;
  value?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type UserInputRange = {
  end?: InputMaybe<Scalars['DateTime']['input']>;
  start?: InputMaybe<Scalars['DateTime']['input']>;
};

export type UserInvoiceFilterInput = {
  column: UserInvoiceTableFilterEnum;
  operator: Scalars['String']['input'];
  type: TableColumnType;
  value?: InputMaybe<Array<Scalars['String']['input']>>;
};

export enum UserInvoiceTableFilterEnum {
  Amount = 'amount',
  AmountDue = 'amountDue',
  AmountPaid = 'amountPaid',
  BundleId = 'bundleId',
  CarId = 'carId',
  CreatedAt = 'createdAt',
  Currency = 'currency',
  Description = 'description',
  Id = 'id',
  InvoiceStatus = 'invoiceStatus',
  ProductsPurchased = 'productsPurchased',
  QuotationId = 'quotationId',
  RazorpayOrderId = 'razorpayOrderId',
  RazorpayPaymentId = 'razorpayPaymentId',
  Receipt = 'receipt',
  UpdatedAt = 'updatedAt',
  UserId = 'userId',
}

export type UserPaymentLog = {
  __typename?: 'UserPaymentLog';
  data?: Maybe<InvoiceRecord>;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export type UserPaymentLogs = {
  __typename?: 'UserPaymentLogs';
  data?: Maybe<Array<InvoiceRecord>>;
  message: Scalars['String']['output'];
  pagination?: Maybe<Pagination>;
  success: Scalars['Boolean']['output'];
};

export type UserPaymentVerification = {
  __typename?: 'UserPaymentVerification';
  data: Data;
  message: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
};

export enum UserTableFilterEnum {
  CompanyName = 'companyName',
  CreatedAt = 'createdAt',
  Email = 'email',
  FirstName = 'firstName',
  Id = 'id',
  IsEmailConfirmed = 'isEmailConfirmed',
  IsPhoneNumberConfirmed = 'isPhoneNumberConfirmed',
  LastName = 'lastName',
  Location = 'location',
  PhoneNumber = 'phoneNumber',
  ProfileImage = 'profileImage',
  Role = 'role',
  Status = 'status',
  UpdatedAt = 'updatedAt',
}

export type VerifyRegistrationWithPhoneNumber = {
  __typename?: 'VerifyRegistrationWithPhoneNumber';
  dealerId?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
  signInToken?: Maybe<Token>;
  success: Scalars['Boolean']['output'];
};

export type ViewAllDealers = {
  __typename?: 'ViewAllDealers';
  data?: Maybe<Array<DealerDetails>>;
  message: Scalars['String']['output'];
  pagination: Pagination;
  success: Scalars['Boolean']['output'];
};

export type YearlyLeads = {
  __typename?: 'YearlyLeads';
  data: Array<MonthlyLeads>;
  year: Scalars['Int']['output'];
};

export type GetDealerQuotationsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  carId?: InputMaybe<Scalars['String']['input']>;
  dealerId?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetDealerQuotationsQuery = {
  __typename?: 'Query';
  getDealerQuotations: {
    __typename?: 'ModifiedGetDealerQuotations';
    message: string;
    success: boolean;
    data: Array<{
      __typename?: 'GetDealerQuotations';
      key: string;
      quotations: Array<{
        __typename?: 'DealerQuotation';
        id: string;
        status: QuotationStatus;
        carId: string;
        adminDetail?: {
          __typename?: 'AdminDetail';
          firstName: string;
          lastName: string;
          email: string;
        } | null;
        quotationDetails: {
          __typename?: 'QuotationDetail';
          noOfLeads: number;
          validityDays: number;
          amount: number;
          currency: string;
          expiryDate?: any | null;
          startDate?: any | null;
        };
        car?: {
          __typename?: 'Car';
          id: string;
          launchYear?: number | null;
          totalRun?: number | null;
          noOfOwners?: number | null;
          model?: string | null;
          companyName: string;
          variant?: string | null;
          registrationNumber?: string | null;
          fuelType?: FuelType | null;
          transmission?: TransmissionType | null;
          status?: CarStatus | null;
          createdAt: any;
          updatedAt: any;
          userId: string;
          quotation?: Array<{
            __typename?: 'Quotation';
            id: string;
            status: QuotationStatus;
            createdAt: any;
          }> | null;
          user?: {
            __typename?: 'User';
            id: string;
            firstName?: string | null;
            lastName?: string | null;
            companyName?: string | null;
            location?: string | null;
            status?: Status | null;
            email?: string | null;
            phoneNumber?: string | null;
            documents?: Array<{
              __typename?: 'UserDocument';
              id: string;
              userId: string;
              fileName: string;
              path: string;
            }> | null;
          } | null;
          products?: Array<{
            __typename?: 'CarProduct';
            id: string;
            fileType: string;
            productType: ProductType;
            amount: number;
            discountedAmount?: number | null;
            currency?: Currency | null;
            thumbnail?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
            documents?: Array<{
              __typename?: 'CarDoc';
              id: string;
              fileName: string;
              path: string;
              documentType: string;
            }> | null;
          }> | null;
          gallery?: Array<{
            __typename?: 'CarGallery';
            id: string;
            fileType: string;
            thumbnail?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          }> | null;
        } | null;
      }>;
    }>;
    pagination?: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    } | null;
  };
};

export type AssignLeadsToDealerMutationVariables = Exact<{
  leads: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type AssignLeadsToDealerMutation = {
  __typename?: 'Mutation';
  assignLeadsToDealer: {
    __typename?: 'UnassignedLeadModel';
    message: string;
    success: boolean;
    data?: Array<{
      __typename?: 'Lead';
      id: string;
      carId: string;
      userId: string;
      leadType: LeadType;
      status: LeadsStatus;
      callCount?: number | null;
      activeQuotation: boolean;
      assigned?: boolean | null;
      contact?: {
        __typename?: 'ContactsData';
        id: string;
        alternatePhone?: string | null;
        alternateEmail?: string | null;
        carId: string;
        contactMessage?: Array<{
          __typename?: 'ContactMessage';
          message: string;
          createdAt: any;
          updatedAt: any;
        }> | null;
      } | null;
      user?: {
        __typename?: 'User';
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        profileImage?: string | null;
        companyName?: string | null;
        location?: string | null;
        status?: Status | null;
        email?: string | null;
        phoneNumber?: string | null;
        documents?: Array<{
          __typename?: 'UserDocument';
          id: string;
          userId: string;
          fileName: string;
          path: string;
        }> | null;
      } | null;
      car?: {
        __typename?: 'CarInLead';
        id: string;
        launchYear?: number | null;
        totalRun?: number | null;
        noOfOwners?: number | null;
        model?: string | null;
        companyName: string;
        variant?: string | null;
        registrationNumber?: string | null;
        fuelType?: FuelType | null;
        transmission?: TransmissionType | null;
        status?: CarStatus | null;
        createdAt: any;
        updatedAt: any;
        userId: string;
        quotation?: Array<{
          __typename?: 'Quotation';
          id: string;
          status: QuotationStatus;
          createdAt: any;
          quotationDetails?: {
            __typename?: 'QuotationDetail';
            noOfLeads: number;
            validityDays: number;
            amount: number;
            currency: string;
            expiryDate?: any | null;
            startDate?: any | null;
          } | null;
        }> | null;
        products?: Array<{
          __typename?: 'CarProduct';
          id: string;
          fileType: string;
          productType: ProductType;
          amount: number;
          discountedAmount?: number | null;
          currency?: Currency | null;
          thumbnail?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          documents?: Array<{
            __typename?: 'CarDoc';
            id: string;
            fileName: string;
            path: string;
            documentType: string;
          }> | null;
        }> | null;
        carGallery?: Array<{
          __typename?: 'CarGalleryDoc';
          id: string;
          fileType: string;
          thumbnail?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          CarGalleryDocuments?: Array<{
            __typename?: 'CarDoc';
            id: string;
            fileName: string;
            path: string;
            documentType: string;
          }> | null;
        }> | null;
      } | null;
    }> | null;
  };
};

export type GetCarAnalyticsReportQueryVariables = Exact<{
  carId: Scalars['String']['input'];
  lead?: InputMaybe<Range>;
  views?: InputMaybe<Range>;
  product?: InputMaybe<Range>;
}>;

export type GetCarAnalyticsReportQuery = {
  __typename?: 'Query';
  getCarAnalyticsReport: {
    __typename?: 'CarAnalyticsResponse';
    message: string;
    success: boolean;
    data: {
      __typename?: 'CarAnalytics';
      totalLeadCount: number;
      totalViewCount: number;
      quotationDetails: {
        __typename?: 'QuotationsSold';
        totalActiveQuotationCount: number;
        totalPendingQuotationCount: number;
        totalCancelledQuotationCount: number;
        totalExpiredQuotationCount: number;
      };
      productDetails: {
        __typename?: 'ProductsSold';
        totalRevenue: number;
        totalProductsSoldCount: number;
        sales: Array<{
          __typename?: 'SalesDetails';
          fileType: string;
          count: number;
        }>;
      };
      totalLeadsInRange: Array<{
        __typename?: 'RangeObject';
        id: string;
        createdAt: any;
        updatedAt: any;
      }>;
      totalViewsInRange: Array<{
        __typename?: 'RangeObject';
        id: string;
        createdAt: any;
        updatedAt: any;
      }>;
      totalProductSoldInRange: Array<{
        __typename?: 'RangeObject';
        id: string;
        createdAt: any;
        updatedAt: any;
      }>;
    };
  };
};

export type CheckCarApproveStatusQueryVariables = Exact<{
  carId: Scalars['String']['input'];
}>;

export type CheckCarApproveStatusQuery = {
  __typename?: 'Query';
  checkCarApproveStatus: {
    __typename?: 'GetCarApproveStatus';
    message: string;
    success: boolean;
    data: {
      __typename?: 'CarApproveStatus';
      approveStatus: boolean;
      requiredData: {
        __typename?: 'RequiredData';
        isCarProductExist: boolean;
        isCarImageExist: boolean;
        isCarVideoExist: boolean;
        isQuotationExist: boolean;
        isQuotationPaid: boolean;
        isThumbnailExist: boolean;
      };
    };
  };
};

export type UploadCarProductsMutationVariables = Exact<{
  files: Array<Scalars['Upload']['input']> | Scalars['Upload']['input'];
  documentType: DocumentTypeDocumentType;
  amount: Scalars['Float']['input'];
  carId: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  uploadCarProductsId?: InputMaybe<Scalars['String']['input']>;
  discountedAmount?: InputMaybe<Scalars['Float']['input']>;
}>;

export type UploadCarProductsMutation = {
  __typename?: 'Mutation';
  uploadCarProducts: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type DeleteProductMutationVariables = Exact<{
  productIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
}>;

export type DeleteProductMutation = {
  __typename?: 'Mutation';
  deleteProduct: { __typename?: 'Response'; message: string; success: boolean };
};

export type DeleteBundleMutationVariables = Exact<{
  bundleId: Scalars['String']['input'];
}>;

export type DeleteBundleMutation = {
  __typename?: 'Mutation';
  deleteBundle: { __typename?: 'Response'; message: string; success: boolean };
};

export type GetStatsCountsDashboardQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetStatsCountsDashboardQuery = {
  __typename?: 'Query';
  getStatsCountsDashboard: {
    __typename?: 'GetStatsCountResponseModel';
    message: string;
    success: boolean;
    data: {
      __typename?: 'GetStatsCountModel';
      totalDealers: number;
      totalCustomers: number;
      totalVisitors: number;
      inPast7DaysVisitors: number;
      leads: {
        __typename?: 'LeadsCount';
        totalLeads: number;
        totalHotAssignedLeads: number;
        totalColdAssignedLeads: number;
        totalHotUnassignedLeads: number;
        totalColdUnassignedLeads: number;
        inPast7DaysLeads: number;
      };
      cars: {
        __typename?: 'CarsCount';
        totalCars: number;
        totalPendingCars: number;
        totalSoldCars: number;
        totalDisabledCars: number;
        totalApprovedCars: number;
        inPast7DaysSoldCars: number;
        inPast7DaysApprovedCars: number;
      };
    };
  };
};

export type GetReportByDateRangeDashboardQueryVariables = Exact<{
  type: DashboardReportType;
  startDate: Scalars['DateTime']['input'];
  endDate: Scalars['DateTime']['input'];
}>;

export type GetReportByDateRangeDashboardQuery = {
  __typename?: 'Query';
  getReportByDateRangeDashboard: {
    __typename?: 'ReportDataModel';
    message: string;
    success: boolean;
    data: Array<{ __typename?: 'ReportData'; key: string; count: number }>;
  };
};

export type ViewDealerQueryVariables = Exact<{
  dealerId: Scalars['String']['input'];
}>;

export type ViewDealerQuery = {
  __typename?: 'Query';
  viewDealer: {
    __typename?: 'GetDealerDetails';
    message: string;
    success: boolean;
    data?: {
      __typename?: 'DealerDetails';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      companyName?: string | null;
      location?: string | null;
      status?: Status | null;
      email?: string | null;
      phoneNumber?: string | null;
      documents?: Array<{
        __typename?: 'DealerDocuments';
        fileType?: string | null;
        docs?: Array<{
          __typename?: 'Doc';
          id: string;
          fileName: string;
          path?: string | null;
          amount?: number | null;
          currency?: Currency | null;
          thumbnail?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        }> | null;
      }> | null;
    } | null;
  };
};

export type ViewDealerDocumentsQueryVariables = Exact<{
  dealerId: Scalars['String']['input'];
}>;

export type ViewDealerDocumentsQuery = {
  __typename?: 'Query';
  viewDealer: {
    __typename?: 'GetDealerDetails';
    message: string;
    success: boolean;
    data?: {
      __typename?: 'DealerDetails';
      id: string;
      status?: Status | null;
      documents?: Array<{
        __typename?: 'DealerDocuments';
        fileType?: string | null;
        docs?: Array<{
          __typename?: 'Doc';
          id: string;
          fileName: string;
          path?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        }> | null;
      }> | null;
    } | null;
  };
};

export type GetDealerAnalyticsQueryVariables = Exact<{
  input?: InputMaybe<DealerAnalyticsDto>;
}>;

export type GetDealerAnalyticsQuery = {
  __typename?: 'Query';
  getDealerAnalytics: {
    __typename?: 'DealerAnalyticsResponse';
    message: string;
    success: boolean;
    data: {
      __typename?: 'DealerAnalyticsReport';
      cars?: {
        __typename?: 'CarsAnalytics';
        totalCarsPosted: number;
        totalCarsApproved: number;
        totalCarsPending: number;
      } | null;
      leads?: {
        __typename?: 'LeadDetails';
        totalUnAssignedLeadsCount?: number | null;
        totalAssignedLeadsCount?: number | null;
        assignedLeads?: Array<{
          __typename?: 'YearlyLeads';
          year: number;
          data: Array<{
            __typename?: 'MonthlyLeads';
            month: string;
            data: Array<{
              __typename?: 'DealerLead';
              id: string;
              leadId?: string | null;
              seen?: boolean | null;
              note?: string | null;
            }>;
          }>;
        }> | null;
        totalLeadsInRange?: Array<{
          __typename?: 'DealerRangeObject';
          id: string;
          createdAt: any;
          updatedAt: any;
        }> | null;
      } | null;
      quotations?: {
        __typename?: 'QuotationsDetails';
        activeQuotations?: number | null;
        pendingQuotations?: number | null;
        totalActiveQuotationsInRange?: Array<{
          __typename?: 'DealerRangeObject';
          id: string;
          createdAt: any;
          updatedAt: any;
        }> | null;
        totalPendingQuotationsInRange?: Array<{
          __typename?: 'DealerRangeObject';
          id: string;
          createdAt: any;
          updatedAt: any;
        }> | null;
      } | null;
    };
  };
};

export type ViewAllDealersQueryVariables = Exact<{
  dealerFilter?: InputMaybe<Array<UserFilterInput> | UserFilterInput>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
}>;

export type ViewAllDealersQuery = {
  __typename?: 'Query';
  viewAllDealers: {
    __typename?: 'ViewAllDealers';
    message: string;
    success: boolean;
    data?: Array<{
      __typename?: 'DealerDetails';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      companyName?: string | null;
      location?: string | null;
      status?: Status | null;
      email?: string | null;
      phoneNumber?: string | null;
      totalCars?: number | null;
      totalActiveQuotation?: number | null;
      totalPendingQuotation?: number | null;
      documents?: Array<{
        __typename?: 'DealerDocuments';
        fileType?: string | null;
        docs?: Array<{
          __typename?: 'Doc';
          id: string;
          fileName: string;
          path?: string | null;
          amount?: number | null;
          currency?: Currency | null;
          thumbnail?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
        }> | null;
      }> | null;
    }> | null;
    pagination: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    };
  };
};

export type DeleteGalleryOrDealerDocumentMutationVariables = Exact<{
  documentId: Scalars['String']['input'];
  docType: DeleteDocType;
}>;

export type DeleteGalleryOrDealerDocumentMutation = {
  __typename?: 'Mutation';
  deleteGalleryOrDealerDocument: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type AdminForgetPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;

export type AdminForgetPasswordMutation = {
  __typename?: 'Mutation';
  adminForgetPassword: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type AdminForgetPasswordEmailVerificationMutationVariables = Exact<{
  token: Scalars['String']['input'];
}>;

export type AdminForgetPasswordEmailVerificationMutation = {
  __typename?: 'Mutation';
  adminForgetPasswordEmailVerification: {
    __typename?: 'ForgetPasswordResponse';
    message: string;
    success: boolean;
    token?: string | null;
  };
};

export type AdminSetForgetPasswordMutationVariables = Exact<{
  token: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
}>;

export type AdminSetForgetPasswordMutation = {
  __typename?: 'Mutation';
  adminSetForgetPassword: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type GetAdminDetailsQueryQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetAdminDetailsQueryQuery = {
  __typename?: 'Query';
  getAdminDetails: {
    __typename?: 'Admin';
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
  };
};

export type GetAdminLeadsQueryVariables = Exact<{
  leadId?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  filter?: InputMaybe<Array<LeadFilterInput> | LeadFilterInput>;
}>;

export type GetAdminLeadsQuery = {
  __typename?: 'Query';
  getAdminLeads: {
    __typename?: 'LeadModel';
    message: string;
    success: boolean;
    data: Array<{
      __typename?: 'Lead';
      id: string;
      carId: string;
      userId: string;
      leadType: LeadType;
      status: LeadsStatus;
      callCount?: number | null;
      activeQuotation: boolean;
      assigned?: boolean | null;
      contact?: {
        __typename?: 'ContactsData';
        id: string;
        alternatePhone?: string | null;
        alternateEmail?: string | null;
        carId: string;
        contactMessage?: Array<{
          __typename?: 'ContactMessage';
          message: string;
          createdAt: any;
          updatedAt: any;
        }> | null;
      } | null;
      user?: {
        __typename?: 'User';
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        profileImage?: string | null;
        companyName?: string | null;
        location?: string | null;
        status?: Status | null;
        email?: string | null;
        phoneNumber?: string | null;
        documents?: Array<{
          __typename?: 'UserDocument';
          id: string;
          userId: string;
          fileName: string;
          path: string;
        }> | null;
      } | null;
      car?: {
        __typename?: 'CarInLead';
        id: string;
        launchYear?: number | null;
        totalRun?: number | null;
        noOfOwners?: number | null;
        model?: string | null;
        companyName: string;
        variant?: string | null;
        registrationNumber?: string | null;
        fuelType?: FuelType | null;
        transmission?: TransmissionType | null;
        status?: CarStatus | null;
        createdAt: any;
        updatedAt: any;
        userId: string;
        quotation?: Array<{
          __typename?: 'Quotation';
          id: string;
          status: QuotationStatus;
          createdAt: any;
          quotationDetails?: {
            __typename?: 'QuotationDetail';
            noOfLeads: number;
            validityDays: number;
            amount: number;
            currency: string;
            expiryDate?: any | null;
            startDate?: any | null;
          } | null;
        }> | null;
        products?: Array<{
          __typename?: 'CarProduct';
          id: string;
          fileType: string;
          productType: ProductType;
          amount: number;
          discountedAmount?: number | null;
          currency?: Currency | null;
          thumbnail?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          documents?: Array<{
            __typename?: 'CarDoc';
            id: string;
            fileName: string;
            path: string;
            documentType: string;
          }> | null;
        }> | null;
        carGallery?: Array<{
          __typename?: 'CarGalleryDoc';
          id: string;
          fileType: string;
          thumbnail?: string | null;
          createdAt?: string | null;
          updatedAt?: string | null;
          CarGalleryDocuments?: Array<{
            __typename?: 'CarDoc';
            id: string;
            fileName: string;
            path: string;
            documentType: string;
          }> | null;
        }> | null;
        user?: {
          __typename?: 'User';
          firstName?: string | null;
          lastName?: string | null;
          id: string;
        } | null;
      } | null;
    }>;
    pagination?: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    } | null;
  };
};

export type GetCarsAdminQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Array<CarsFilterInput> | CarsFilterInput>;
  suggestedColumn?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetCarsAdminQuery = {
  __typename?: 'Query';
  getCarsAdmin: {
    __typename?: 'GetAllCarsAdmin';
    message: string;
    success: boolean;
    data: Array<{
      __typename?: 'Car';
      id: string;
      launchYear?: number | null;
      totalRun?: number | null;
      noOfOwners?: number | null;
      model?: string | null;
      companyName: string;
      variant?: string | null;
      registrationNumber?: string | null;
      fuelType?: FuelType | null;
      transmission?: TransmissionType | null;
      status?: CarStatus | null;
      createdAt: any;
      updatedAt: any;
      userId: string;
      quotation?: Array<{
        __typename?: 'Quotation';
        id: string;
        status: QuotationStatus;
        createdAt: any;
        quotationDetails?: {
          __typename?: 'QuotationDetail';
          noOfLeads: number;
          validityDays: number;
          amount: number;
          currency: string;
          expiryDate?: any | null;
          startDate?: any | null;
        } | null;
      }> | null;
      user?: {
        __typename?: 'User';
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        companyName?: string | null;
        location?: string | null;
        status?: Status | null;
        email?: string | null;
        phoneNumber?: string | null;
        documents?: Array<{
          __typename?: 'UserDocument';
          id: string;
          userId: string;
          fileName: string;
          path: string;
        }> | null;
      } | null;
      products?: Array<{
        __typename?: 'CarProduct';
        id: string;
        fileType: string;
        productType: ProductType;
        amount: number;
        discountedAmount?: number | null;
        currency?: Currency | null;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        documents?: Array<{
          __typename?: 'CarDoc';
          id: string;
          fileName: string;
          path: string;
          documentType: string;
        }> | null;
      }> | null;
      gallery?: Array<{
        __typename?: 'CarGallery';
        id: string;
        fileType: string;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      }> | null;
    }>;
    pagination?: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    } | null;
  };
};

export type GetAllCustomersQueryVariables = Exact<{ [key: string]: never }>;

export type GetAllCustomersQuery = {
  __typename?: 'Query';
  getAllCustomers: {
    __typename?: 'AllUsers';
    message: string;
    success: boolean;
    data: Array<{
      __typename?: 'User';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      status?: Status | null;
      email?: string | null;
      phoneNumber?: string | null;
    }>;
  };
};

export type GetPaymentHistoryListQueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetPaymentHistoryListQuery = {
  __typename?: 'Query';
  getPaymentHistoryList: {
    __typename?: 'UserPaymentLogs';
    message: string;
    success: boolean;
    data?: Array<{
      __typename?: 'InvoiceRecord';
      id: string;
      quotationId?: string | null;
      razorpayOrderId: string;
      carId?: string | null;
      userName: string;
      userId?: string | null;
      razorpayPaymentId?: string | null;
      amount: number;
      invoiceStatus: string;
      amountPaid: number;
      amountDue: number;
      receipt?: string | null;
      createdAt: any;
      updatedAt: any;
      userRole: Roles;
      carDetail?: string | null;
      quotation?: {
        __typename?: 'PaymentQuotationDetails';
        car: { __typename?: 'QuotationCarDetails'; registrationNumber: string };
      } | null;
      productsPurchased?: Array<{
        __typename?: 'CarProduct';
        id: string;
        fileType: string;
        productType: ProductType;
        amount: number;
        discountedAmount?: number | null;
        currency?: Currency | null;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        documents?: Array<{
          __typename?: 'CarDoc';
          id: string;
          fileName: string;
          path: string;
          documentType: string;
        }> | null;
      }> | null;
      bundleDetails?: {
        __typename?: 'CarProduct';
        id: string;
        fileType: string;
        productType: ProductType;
        amount: number;
        discountedAmount?: number | null;
        currency?: Currency | null;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null;
    }> | null;
    pagination?: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    } | null;
  };
};

export type GetCarBundleQueryVariables = Exact<{
  bundleId: Scalars['String']['input'];
  carId: Scalars['String']['input'];
}>;

export type GetCarBundleQuery = {
  __typename?: 'Query';
  getCarBundle: {
    __typename?: 'GetCarBundle';
    message: string;
    success: boolean;
    data?: {
      __typename?: 'CarBundle';
      id: string;
      fileType: string;
      thumbnail?: string | null;
      amount: number;
      bundledItems: Array<{
        __typename?: 'BundledItems';
        CarProduct: {
          __typename?: 'BundleCarProduct';
          id: string;
          fileType: string;
          amount: number;
          productType: ProductType;
          thumbnail?: string | null;
          createdAt: any;
          updatedAt: any;
          CarProductDocuments?: Array<{
            __typename?: 'CarProductDocuments';
            documentType: DocumentTypeDocumentType;
            fileName: string;
            path: string;
          }> | null;
        };
      }>;
    } | null;
  };
};

export type GetCarBundlesQueryVariables = Exact<{
  carId: Scalars['String']['input'];
}>;

export type GetCarBundlesQuery = {
  __typename?: 'Query';
  getCarBundles: {
    __typename?: 'GetCarBundles';
    message: string;
    success: boolean;
    data?: Array<{
      __typename?: 'CarBundle';
      id: string;
      fileType: string;
      thumbnail?: string | null;
      amount: number;
      bundledItems: Array<{
        __typename?: 'BundledItems';
        CarProduct: {
          __typename?: 'BundleCarProduct';
          id: string;
          fileType: string;
          amount: number;
          productType: ProductType;
          thumbnail?: string | null;
          createdAt: any;
          updatedAt: any;
          CarProductDocuments?: Array<{
            __typename?: 'CarProductDocuments';
            documentType: DocumentTypeDocumentType;
            fileName: string;
            path: string;
          }> | null;
        };
      }>;
    }> | null;
  };
};

export type GetCarDetailAdminQueryVariables = Exact<{
  carId: Scalars['String']['input'];
}>;

export type GetCarDetailAdminQuery = {
  __typename?: 'Query';
  getCarDetailAdmin: {
    __typename?: 'GetCarDetailAdmin';
    message: string;
    success: boolean;
    data: {
      __typename?: 'Car';
      id: string;
      launchYear?: number | null;
      totalRun?: number | null;
      noOfOwners?: number | null;
      model?: string | null;
      companyName: string;
      variant?: string | null;
      registrationNumber?: string | null;
      fuelType?: FuelType | null;
      transmission?: TransmissionType | null;
      status?: CarStatus | null;
      createdAt: any;
      updatedAt: any;
      userId: string;
      quotation?: Array<{
        __typename?: 'Quotation';
        id: string;
        status: QuotationStatus;
        createdAt: any;
        quotationDetails?: {
          __typename?: 'QuotationDetail';
          noOfLeads: number;
          validityDays: number;
          amount: number;
          currency: string;
          expiryDate?: any | null;
          startDate?: any | null;
        } | null;
      }> | null;
      user?: {
        __typename?: 'User';
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        companyName?: string | null;
        location?: string | null;
        status?: Status | null;
        email?: string | null;
        phoneNumber?: string | null;
        documents?: Array<{
          __typename?: 'UserDocument';
          id: string;
          userId: string;
          fileName: string;
          path: string;
        }> | null;
      } | null;
      products?: Array<{
        __typename?: 'CarProduct';
        id: string;
        fileType: string;
        productType: ProductType;
        amount: number;
        discountedAmount?: number | null;
        currency?: Currency | null;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        documents?: Array<{
          __typename?: 'CarDoc';
          id: string;
          fileName: string;
          path: string;
          documentType: string;
        }> | null;
      }> | null;
      gallery?: Array<{
        __typename?: 'CarGallery';
        id: string;
        fileType: string;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        documents: Array<{
          __typename?: 'CarDoc';
          id: string;
          fileName: string;
          path: string;
          documentType: string;
        }>;
      }> | null;
    };
  };
};

export type GetCarListViewedByUserQueryVariables = Exact<{
  userId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
}>;

export type GetCarListViewedByUserQuery = {
  __typename?: 'Query';
  getCarListViewedByUser: {
    __typename?: 'GetAllCarsAdmin';
    message: string;
    success: boolean;
    data: Array<{
      __typename?: 'Car';
      id: string;
      launchYear?: number | null;
      totalRun?: number | null;
      noOfOwners?: number | null;
      model?: string | null;
      companyName: string;
      variant?: string | null;
      registrationNumber?: string | null;
      fuelType?: FuelType | null;
      transmission?: TransmissionType | null;
      status?: CarStatus | null;
      createdAt: any;
      updatedAt: any;
      userId: string;
      quotation?: Array<{
        __typename?: 'Quotation';
        id: string;
        status: QuotationStatus;
        createdAt: any;
        quotationDetails?: {
          __typename?: 'QuotationDetail';
          noOfLeads: number;
          validityDays: number;
          amount: number;
          currency: string;
          expiryDate?: any | null;
          startDate?: any | null;
        } | null;
      }> | null;
      user?: {
        __typename?: 'User';
        id: string;
        firstName?: string | null;
        lastName?: string | null;
        companyName?: string | null;
        location?: string | null;
        status?: Status | null;
        email?: string | null;
        phoneNumber?: string | null;
        documents?: Array<{
          __typename?: 'UserDocument';
          id: string;
          userId: string;
          fileName: string;
          path: string;
        }> | null;
      } | null;
      products?: Array<{
        __typename?: 'CarProduct';
        id: string;
        fileType: string;
        productType: ProductType;
        amount: number;
        discountedAmount?: number | null;
        currency?: Currency | null;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        documents?: Array<{
          __typename?: 'CarDoc';
          id: string;
          fileName: string;
          path: string;
          documentType: string;
        }> | null;
      }> | null;
      gallery?: Array<{
        __typename?: 'CarGallery';
        id: string;
        fileType: string;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      }> | null;
    }>;
    pagination?: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    } | null;
  };
};

export type GetCarViewersQueryVariables = Exact<{
  carId: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
}>;

export type GetCarViewersQuery = {
  __typename?: 'Query';
  getCarViewers: {
    __typename?: 'CarViewers';
    message: string;
    success: boolean;
    data?: Array<{
      __typename?: 'CarSingleView';
      ipAddress: string;
      viewsCount: number;
      latestViewedAt: any;
      userAgent: string;
      userId?: string | null;
      user?: {
        __typename?: 'CarViewerUser';
        firstName?: string | null;
        lastName?: string | null;
      } | null;
    }> | null;
    pagination?: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    } | null;
  };
};

export type GetCustomersDetailsQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;

export type GetCustomersDetailsQuery = {
  __typename?: 'Query';
  getCustomersDetails: {
    __typename?: 'UserDetails';
    message: string;
    success: boolean;
    data?: {
      __typename?: 'User';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      status?: Status | null;
      email?: string | null;
      phoneNumber?: string | null;
    } | null;
  };
};

export type GetNewTokensQueryMutationVariables = Exact<{
  refreshToken: Scalars['String']['input'];
}>;

export type GetNewTokensQueryMutation = {
  __typename?: 'Mutation';
  getNewTokens: {
    __typename?: 'Token';
    accessToken: string;
    refreshToken: string;
  };
};

export type GetLeadPaymentHistoryListQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  filter?: InputMaybe<Array<UserInvoiceFilterInput> | UserInvoiceFilterInput>;
}>;

export type GetLeadPaymentHistoryListQuery = {
  __typename?: 'Query';
  getPaymentHistoryList: {
    __typename?: 'UserPaymentLogs';
    message: string;
    success: boolean;
    data?: Array<{
      __typename?: 'InvoiceRecord';
      id: string;
      quotationId?: string | null;
      razorpayOrderId: string;
      carId?: string | null;
      userId?: string | null;
      razorpayPaymentId?: string | null;
      amount: number;
      invoiceStatus: string;
      amountPaid: number;
      amountDue: number;
      receipt?: string | null;
      createdAt: any;
      updatedAt: any;
      quotation?: {
        __typename?: 'PaymentQuotationDetails';
        car: { __typename?: 'QuotationCarDetails'; registrationNumber: string };
      } | null;
      productsPurchased?: Array<{
        __typename?: 'CarProduct';
        id: string;
        fileType: string;
        productType: ProductType;
        amount: number;
        discountedAmount?: number | null;
        currency?: Currency | null;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        documents?: Array<{
          __typename?: 'CarDoc';
          id: string;
          fileName: string;
          path: string;
          documentType: string;
        }> | null;
      }> | null;
      bundleDetails?: {
        __typename?: 'CarProduct';
        id: string;
        fileType: string;
        productType: ProductType;
        amount: number;
        discountedAmount?: number | null;
        currency?: Currency | null;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
      } | null;
    }> | null;
    pagination?: {
      __typename?: 'Pagination';
      maxPage: number;
      currentPage: number;
      total: number;
      limit: number;
    } | null;
  };
};

export type AdminLoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;

export type AdminLoginMutation = {
  __typename?: 'Mutation';
  adminLogin: {
    __typename?: 'SignInResponse';
    message: string;
    success: boolean;
    signInToken?: {
      __typename?: 'Token';
      accessToken: string;
      refreshToken: string;
    } | null;
  };
};

export type MakeBundleMutationVariables = Exact<{
  carId: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']> | Scalars['String']['input'];
  name: Scalars['String']['input'];
  amount: Scalars['Int']['input'];
  discountedAmount?: InputMaybe<Scalars['Int']['input']>;
}>;

export type MakeBundleMutation = {
  __typename?: 'Mutation';
  makeBundle: { __typename?: 'Response'; message: string; success: boolean };
};

export type RaiseQuotationQueryMutationVariables = Exact<{
  carId: Scalars['String']['input'];
  noOfLeads: Scalars['Float']['input'];
  validityDays: Scalars['Float']['input'];
  amount: Scalars['Float']['input'];
}>;

export type RaiseQuotationQueryMutation = {
  __typename?: 'Mutation';
  raiseQuotation: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type UpdateCarStatusMutationVariables = Exact<{
  cartData: UpdateCarStatus;
}>;

export type UpdateCarStatusMutation = {
  __typename?: 'Mutation';
  updateCarStatus: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type UpdateDealerStatusMutationVariables = Exact<{
  updateDealerStatusId: Scalars['String']['input'];
  status: Application;
}>;

export type UpdateDealerStatusMutation = {
  __typename?: 'Mutation';
  updateDealerStatus: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type UploadCarGalleryDocumentsMutationVariables = Exact<{
  files: Array<Scalars['Upload']['input']> | Scalars['Upload']['input'];
  documentType: DocumentTypeDocumentType;
  carId: Scalars['String']['input'];
  fileType: Scalars['String']['input'];
  isThumbnail: Scalars['Boolean']['input'];
  uploadCarGalleryDocumentsId?: InputMaybe<Scalars['String']['input']>;
}>;

export type UploadCarGalleryDocumentsMutation = {
  __typename?: 'Mutation';
  uploadCarGalleryDocuments: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type UploadUserDocumentMutationVariables = Exact<{
  files: Array<Scalars['Upload']['input']> | Scalars['Upload']['input'];
  fileType: Scalars['String']['input'];
  uploadCategory: FileType;
  dealerId: Scalars['String']['input'];
}>;

export type UploadUserDocumentMutation = {
  __typename?: 'Mutation';
  uploadUserDocument: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export const GetDealerQuotationsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetDealerQuotations' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'dealerId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getDealerQuotations' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dealerId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'dealerId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotations' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'adminDetail' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'email' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'carId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quotationDetails' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'noOfLeads' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'validityDays',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expiryDate' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startDate' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'car' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'launchYear' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'totalRun' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'noOfOwners' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'model' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'companyName',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'variant' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'registrationNumber',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fuelType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'transmission',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'userId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'quotation' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'status',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'createdAt',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'user' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'firstName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'lastName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'companyName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'location',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'status',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'email',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'phoneNumber',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documents',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'userId',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'fileName',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'path',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'products' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'productType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'amount',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'discountedAmount',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'currency',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'thumbnail',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documents',
                                          },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'fileName',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'path',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'documentType',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'createdAt',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'updatedAt',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'gallery' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'thumbnail',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'createdAt',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'updatedAt',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetDealerQuotationsQuery,
  GetDealerQuotationsQueryVariables
>;
export const AssignLeadsToDealerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AssignLeadsToDealer' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'leads' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'String' },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'assignLeadsToDealer' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'leads' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'leads' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'carId' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contact' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'contactMessage' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'alternatePhone' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'alternateEmail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'carId' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leadType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'firstName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'profileImage' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'companyName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'phoneNumber' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'userId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'car' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'launchYear' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalRun' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'noOfOwners' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'model' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'companyName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'variant' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'registrationNumber',
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fuelType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'transmission' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'userId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quotation' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'quotationDetails',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'noOfLeads',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'validityDays',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'amount',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'currency',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'expiryDate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'startDate',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'products' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'productType',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'discountedAmount',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'documents' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'path' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documentType',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'carGallery' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'CarGalleryDocuments',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'path' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documentType',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'callCount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'activeQuotation' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'assigned' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AssignLeadsToDealerMutation,
  AssignLeadsToDealerMutationVariables
>;
export const GetCarAnalyticsReportDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarAnalyticsReport' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'lead' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Range' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'views' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Range' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'product' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Range' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCarAnalyticsReport' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lead' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'lead' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'views' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'views' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'product' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'product' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotationDetails' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalActiveQuotationCount',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalPendingQuotationCount',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalCancelledQuotationCount',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalExpiredQuotationCount',
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalLeadCount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalViewCount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productDetails' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalRevenue' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalProductsSoldCount',
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'sales' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'count' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalLeadsInRange' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalViewsInRange' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: {
                          kind: 'Name',
                          value: 'totalProductSoldInRange',
                        },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCarAnalyticsReportQuery,
  GetCarAnalyticsReportQueryVariables
>;
export const CheckCarApproveStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CheckCarApproveStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'checkCarApproveStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'requiredData' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'isCarProductExist',
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isCarImageExist' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isCarVideoExist' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isQuotationExist' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isQuotationPaid' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'isThumbnailExist' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'approveStatus' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  CheckCarApproveStatusQuery,
  CheckCarApproveStatusQueryVariables
>;
export const UploadCarProductsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UploadCarProducts' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'files' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'Upload' },
                },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'documentType' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'DocumentTypeDocumentType' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'amount' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'fileType' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'uploadCarProductsId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'discountedAmount' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'uploadCarProducts' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'files' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'files' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'documentType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'documentType' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'amount' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'amount' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'fileType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'fileType' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uploadCarProductsId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'discountedAmount' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'discountedAmount' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UploadCarProductsMutation,
  UploadCarProductsMutationVariables
>;
export const DeleteProductDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteProduct' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'productIds' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'String' },
                },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteProduct' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'productIds' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'productIds' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteProductMutation,
  DeleteProductMutationVariables
>;
export const DeleteBundleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteBundle' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'bundleId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteBundle' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'bundleId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'bundleId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteBundleMutation,
  DeleteBundleMutationVariables
>;
export const GetStatsCountsDashboardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetStatsCountsDashboard' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getStatsCountsDashboard' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leads' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalLeads' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalHotAssignedLeads',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalColdAssignedLeads',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalHotUnassignedLeads',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalColdUnassignedLeads',
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'inPast7DaysLeads' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cars' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalCars' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalPendingCars' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalSoldCars' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalDisabledCars',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalApprovedCars',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'inPast7DaysSoldCars',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'inPast7DaysApprovedCars',
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalDealers' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCustomers' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalVisitors' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'inPast7DaysVisitors' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetStatsCountsDashboardQuery,
  GetStatsCountsDashboardQueryVariables
>;
export const GetReportByDateRangeDashboardDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetReportByDateRangeDashboard' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'type' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'DashboardReportType' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'startDate' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'DateTime' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'endDate' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'DateTime' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getReportByDateRangeDashboard' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'type' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'type' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'startDate' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'startDate' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'endDate' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'endDate' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetReportByDateRangeDashboardQuery,
  GetReportByDateRangeDashboardQueryVariables
>;
export const ViewDealerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ViewDealer' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'dealerId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'viewDealer' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dealerId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'dealerId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'firstName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'lastName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'companyName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'location' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'phoneNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'documents' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'docs' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ViewDealerQuery, ViewDealerQueryVariables>;
export const ViewDealerDocumentsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ViewDealerDocuments' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'dealerId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'viewDealer' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dealerId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'dealerId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'documents' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'docs' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  ViewDealerDocumentsQuery,
  ViewDealerDocumentsQueryVariables
>;
export const GetDealerAnalyticsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetDealerAnalytics' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'input' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'DealerAnalyticsDto' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getDealerAnalytics' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'input' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'cars' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalCarsPosted' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalCarsApproved',
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalCarsPending' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leads' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'assignedLeads' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'year' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'data' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'month',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'data' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'id',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'leadId',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'seen',
                                                },
                                              },
                                              {
                                                kind: 'Field',
                                                name: {
                                                  kind: 'Name',
                                                  value: 'note',
                                                },
                                              },
                                            ],
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalUnAssignedLeadsCount',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalAssignedLeadsCount',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalLeadsInRange',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotations' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'activeQuotations' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'pendingQuotations',
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalActiveQuotationsInRange',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'totalPendingQuotationsInRange',
                              },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetDealerAnalyticsQuery,
  GetDealerAnalyticsQueryVariables
>;
export const ViewAllDealersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'ViewAllDealers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'dealerFilter' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'UserFilterInput' },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'viewAllDealers' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dealerFilter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'dealerFilter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'firstName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'lastName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'companyName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'location' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'phoneNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalCars' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalActiveQuotation' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalPendingQuotation' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'documents' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'docs' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<ViewAllDealersQuery, ViewAllDealersQueryVariables>;
export const DeleteGalleryOrDealerDocumentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteGalleryOrDealerDocument' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'documentId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'docType' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'DeleteDocType' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteGalleryOrDealerDocument' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'documentId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'documentId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'docType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'docType' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  DeleteGalleryOrDealerDocumentMutation,
  DeleteGalleryOrDealerDocumentMutationVariables
>;
export const AdminForgetPasswordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AdminForgetPassword' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'adminForgetPassword' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AdminForgetPasswordMutation,
  AdminForgetPasswordMutationVariables
>;
export const AdminForgetPasswordEmailVerificationDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AdminForgetPasswordEmailVerification' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'token' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: {
              kind: 'Name',
              value: 'adminForgetPasswordEmailVerification',
            },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'token' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                { kind: 'Field', name: { kind: 'Name', value: 'token' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AdminForgetPasswordEmailVerificationMutation,
  AdminForgetPasswordEmailVerificationMutationVariables
>;
export const AdminSetForgetPasswordDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'AdminSetForgetPassword' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'token' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'newPassword' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'adminSetForgetPassword' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'token' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'token' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'newPassword' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'newPassword' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  AdminSetForgetPasswordMutation,
  AdminSetForgetPasswordMutationVariables
>;
export const GetAdminDetailsQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAdminDetailsQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getAdminDetails' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAdminDetailsQueryQuery,
  GetAdminDetailsQueryQueryVariables
>;
export const GetAdminLeadsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAdminLeads' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'leadId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'LeadFilterInput' },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getAdminLeads' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'leadId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'leadId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'carId' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'contact' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'contactMessage' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'message' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'alternatePhone' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'alternateEmail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'carId' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'leadType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'firstName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'profileImage' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'companyName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'phoneNumber' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'userId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'car' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'launchYear' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'totalRun' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'noOfOwners' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'model' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'companyName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'variant' },
                            },
                            {
                              kind: 'Field',
                              name: {
                                kind: 'Name',
                                value: 'registrationNumber',
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fuelType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'transmission' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'userId' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quotation' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'status' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'quotationDetails',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'noOfLeads',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'validityDays',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'amount',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'currency',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'expiryDate',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'startDate',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'products' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'productType',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'discountedAmount',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'documents' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'path' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documentType',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'carGallery' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'CarGalleryDocuments',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'id' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'path' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documentType',
                                          },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'firstName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'lastName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'callCount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'activeQuotation' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'assigned' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAdminLeadsQuery, GetAdminLeadsQueryVariables>;
export const GetCarsAdminDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarsAdmin' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'searchString' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'CarsFilterInput' },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'suggestedColumn' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCarsAdmin' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'searchString' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'searchString' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'suggestedColumn' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'suggestedColumn' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchYear' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalRun' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'noOfOwners' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'model' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'companyName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'variant' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'registrationNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fuelType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'transmission' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotation' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quotationDetails' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'noOfLeads' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'validityDays',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expiryDate' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startDate' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'firstName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'companyName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'phoneNumber' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'userId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'products' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'currency' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'documentType',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'gallery' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCarsAdminQuery, GetCarsAdminQueryVariables>;
export const GetAllCustomersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetAllCustomers' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getAllCustomers' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'firstName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'lastName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'phoneNumber' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetAllCustomersQuery,
  GetAllCustomersQueryVariables
>;
export const GetPaymentHistoryListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPaymentHistoryList' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getPaymentHistoryList' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotationId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotation' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'car' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'registrationNumber',
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'razorpayOrderId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productsPurchased' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'currency' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'documentType',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'bundleDetails' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'currency' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'carId' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'razorpayPaymentId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'invoiceStatus' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amountPaid' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amountDue' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'receipt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userRole' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'carDetail' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPaymentHistoryListQuery,
  GetPaymentHistoryListQueryVariables
>;
export const GetCarBundleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarBundle' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'bundleId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCarBundle' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'bundleId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'bundleId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fileType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'thumbnail' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'bundledItems' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'CarProduct' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'productType',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'CarProductDocuments',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documentType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'path' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCarBundleQuery, GetCarBundleQueryVariables>;
export const GetCarBundlesDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarBundles' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCarBundles' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fileType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'thumbnail' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'bundledItems' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'CarProduct' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileType' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'productType',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'thumbnail' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'createdAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'updatedAt' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'CarProductDocuments',
                                    },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'documentType',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: {
                                            kind: 'Name',
                                            value: 'fileName',
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'path' },
                                        },
                                      ],
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCarBundlesQuery, GetCarBundlesQueryVariables>;
export const GetCarDetailAdminDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarDetailAdmin' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCarDetailAdmin' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchYear' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalRun' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'noOfOwners' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'model' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'companyName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'variant' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'registrationNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fuelType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'transmission' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotation' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quotationDetails' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'noOfLeads' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'validityDays',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expiryDate' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startDate' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'firstName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'companyName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'phoneNumber' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'userId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'products' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'currency' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'documentType',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'gallery' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'documentType',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCarDetailAdminQuery,
  GetCarDetailAdminQueryVariables
>;
export const GetCarListViewedByUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarListViewedByUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'userId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCarListViewedByUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'userId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'launchYear' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'totalRun' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'noOfOwners' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'model' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'companyName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'variant' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'registrationNumber' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'fuelType' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'transmission' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotation' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'quotationDetails' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'noOfLeads' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'validityDays',
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'amount' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'currency' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'expiryDate' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'startDate' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'firstName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'companyName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'status' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'phoneNumber' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'userId' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'products' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'currency' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'documentType',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'gallery' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCarListViewedByUserQuery,
  GetCarListViewedByUserQueryVariables
>;
export const GetCarViewersDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarViewers' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCarViewers' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'ipAddress' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'viewsCount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'latestViewedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userAgent' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'firstName' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'lastName' },
                            },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetCarViewersQuery, GetCarViewersQueryVariables>;
export const GetCustomersDetailsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCustomersDetails' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'userId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getCustomersDetails' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'userId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'firstName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'lastName' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'status' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'phoneNumber' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetCustomersDetailsQuery,
  GetCustomersDetailsQueryVariables
>;
export const GetNewTokensQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GetNewTokensQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'refreshToken' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getNewTokens' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'refreshToken' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'refreshToken' },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetNewTokensQueryMutation,
  GetNewTokensQueryMutationVariables
>;
export const GetLeadPaymentHistoryListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetLeadPaymentHistoryList' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'page' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'userId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'limit' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'filter' },
          },
          type: {
            kind: 'ListType',
            type: {
              kind: 'NonNullType',
              type: {
                kind: 'NamedType',
                name: { kind: 'Name', value: 'UserInvoiceFilterInput' },
              },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getPaymentHistoryList' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'page' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'page' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'userId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'filter' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'filter' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'data' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotationId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'quotation' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'car' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'registrationNumber',
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'razorpayOrderId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'productsPurchased' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'currency' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'path' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: {
                                      kind: 'Name',
                                      value: 'documentType',
                                    },
                                  },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'bundleDetails' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'amount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'currency' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'createdAt' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'updatedAt' },
                            },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'carId' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'razorpayPaymentId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amount' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'invoiceStatus' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amountPaid' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'amountDue' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'receipt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pagination' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'maxPage' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'currentPage' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'total' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'limit' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetLeadPaymentHistoryListQuery,
  GetLeadPaymentHistoryListQueryVariables
>;
export const AdminLoginDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'adminLogin' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'password' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'adminLogin' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'email' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'email' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'password' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'password' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'signInToken' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'accessToken' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'refreshToken' },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<AdminLoginMutation, AdminLoginMutationVariables>;
export const MakeBundleDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'MakeBundle' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'productIds' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'String' },
                },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'name' } },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'amount' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'discountedAmount' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'makeBundle' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'productIds' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'productIds' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'name' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'name' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'amount' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'amount' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'discountedAmount' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'discountedAmount' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<MakeBundleMutation, MakeBundleMutationVariables>;
export const RaiseQuotationQueryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RaiseQuotationQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'noOfLeads' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'validityDays' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'amount' },
          },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'raiseQuotation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'noOfLeads' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'noOfLeads' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'validityDays' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'validityDays' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'amount' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'amount' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RaiseQuotationQueryMutation,
  RaiseQuotationQueryMutationVariables
>;
export const UpdateCarStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCarStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'cartData' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'UpdateCarStatus' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateCarStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'cartData' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'cartData' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateCarStatusMutation,
  UpdateCarStatusMutationVariables
>;
export const UpdateDealerStatusDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateDealerStatus' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'updateDealerStatusId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'status' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Application' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateDealerStatus' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'updateDealerStatusId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'status' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'status' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateDealerStatusMutation,
  UpdateDealerStatusMutationVariables
>;
export const UploadCarGalleryDocumentsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UploadCarGalleryDocuments' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'files' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'Upload' },
                },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'documentType' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'DocumentTypeDocumentType' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'carId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'fileType' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'isThumbnail' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'Boolean' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'uploadCarGalleryDocumentsId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'uploadCarGalleryDocuments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'files' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'files' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'documentType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'documentType' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'carId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'carId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'fileType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'fileType' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'isThumbnail' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'isThumbnail' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uploadCarGalleryDocumentsId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UploadCarGalleryDocumentsMutation,
  UploadCarGalleryDocumentsMutationVariables
>;
export const UploadUserDocumentDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UploadUserDocument' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'files' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'ListType',
              type: {
                kind: 'NonNullType',
                type: {
                  kind: 'NamedType',
                  name: { kind: 'Name', value: 'Upload' },
                },
              },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'fileType' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'uploadCategory' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'FileType' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'dealerId' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'String' },
            },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'uploadUserDocument' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'files' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'files' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'fileType' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'fileType' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'uploadCategory' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'uploadCategory' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dealerId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'dealerId' },
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'message' } },
                { kind: 'Field', name: { kind: 'Name', value: 'success' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UploadUserDocumentMutation,
  UploadUserDocumentMutationVariables
>;
