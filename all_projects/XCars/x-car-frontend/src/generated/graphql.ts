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

export type CarSingleView = {
  __typename?: 'CarSingleView';
  ipAddress: Scalars['String']['output'];
  latestViewedAt: Scalars['DateTime']['output'];
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
  Car = 'CAR',
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

export type InvoiceRecord = {
  __typename?: 'InvoiceRecord';
  amount: Scalars['Float']['output'];
  amountDue: Scalars['Float']['output'];
  amountPaid: Scalars['Float']['output'];
  bundleDetails?: Maybe<CarProduct>;
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
};

export type Lead = {
  __typename?: 'Lead';
  activeQuotation: Scalars['Boolean']['output'];
  assigned?: Maybe<Scalars['Boolean']['output']>;
  car?: Maybe<Car>;
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
  deleteDocument: Response;
  deleteGallery: Response;
  deleteProduct: Response;
  getNewTokens: Token;
  loginWithPhoneOtp: Response;
  makeBundle: Response;
  raiseQuotation: Response;
  registerDealerWithPhoneNumberViaOtp: Response;
  registerUser: Response;
  sendEmailOtp: Response;
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

export type MutationDeleteDocumentArgs = {
  docType: DeleteDocType;
  documentIds: Array<Scalars['String']['input']>;
};

export type MutationDeleteGalleryArgs = {
  galleryIds: Array<Scalars['String']['input']>;
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
  getUserDetails: User;
  getVariantForModel: DropdownVariant;
  storeDealerAnalyticsData: Response;
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

export type QueryStoreDealerAnalyticsDataArgs = {
  customerId: Scalars['String']['input'];
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

export type GetCarDetailUserQueryVariables = Exact<{
  carId: Scalars['String']['input'];
}>;

export type GetCarDetailUserQuery = {
  __typename?: 'Query';
  getCarDetailUser: {
    __typename?: 'GetCarDetailUser';
    message: string;
    success: boolean;
    data: {
      __typename?: 'UserCarDetails';
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
      lead?: boolean | null;
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
      products?: Array<{
        __typename?: 'CarProduct';
        amount: number;
        currency?: Currency | null;
        discountedAmount?: number | null;
        fileType: string;
        id: string;
        productType: ProductType;
        thumbnail?: string | null;
        documents?: Array<{
          __typename?: 'CarDoc';
          documentType: string;
          id: string;
          fileName: string;
          path: string;
        }> | null;
      }> | null;
    };
  };
};

export type GetCarsUserQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  searchString?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Array<CarsFilterInput> | CarsFilterInput>;
  suggestedColumn?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetCarsUserQuery = {
  __typename?: 'Query';
  getCarsUser: {
    __typename?: 'GetAllCarsUser';
    message: string;
    success: boolean;
    data: Array<{
      __typename?: 'UserCarDetails';
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
      lead?: boolean | null;
      userId: string;
      updatedAt: any;
      createdAt: any;
      gallery?: Array<{
        __typename?: 'CarGallery';
        id: string;
        fileType: string;
        thumbnail?: string | null;
        createdAt?: string | null;
        updatedAt?: string | null;
        documents: Array<{
          __typename?: 'CarDoc';
          documentType: string;
          fileName: string;
          id: string;
          path: string;
        }>;
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

export type CreateOrderForEndUserMutationVariables = Exact<{
  carId: Scalars['String']['input'];
  bundleId?: InputMaybe<Scalars['String']['input']>;
  products?: InputMaybe<
    Array<Scalars['String']['input']> | Scalars['String']['input']
  >;
}>;

export type CreateOrderForEndUserMutation = {
  __typename?: 'Mutation';
  createOrderForEndUser: {
    __typename?: 'RazorpayOrderWeb';
    message: string;
    success: boolean;
    order: {
      __typename?: 'OrderDetails';
      id: string;
      entity: string;
      amount: string;
      currency: string;
      description: string;
      order_id: string;
      name: string;
      theme: { __typename?: 'Theme'; color: string };
      prefill: {
        __typename?: 'Prefill';
        name: string;
        email: string;
        contact: string;
      };
    };
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

export type GetContactDataQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
}>;

export type GetContactDataQuery = {
  __typename?: 'Query';
  getContactData: {
    __typename?: 'GetContactsData';
    message: string;
    success: boolean;
    data: Array<{
      __typename?: 'ContactsDataInQuoteModel';
      id: string;
      alternatePhone?: string | null;
      alternateEmail?: string | null;
      contactMessage?: Array<{
        __typename?: 'ContactMessage';
        message: string;
        createdAt: any;
        updatedAt: any;
      }> | null;
      car: {
        __typename?: 'BasicCarData';
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
      };
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

export type GetUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type GetUserDetailsQuery = {
  __typename?: 'Query';
  getUserDetails: {
    __typename?: 'User';
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    location?: string | null;
  };
};

export type CustomerLoginWithPhoneOtpMutationVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
}>;

export type CustomerLoginWithPhoneOtpMutation = {
  __typename?: 'Mutation';
  customerLoginWithPhoneOtp: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type GetPaymentHistoryQueryVariables = Exact<{
  paymentId: Scalars['String']['input'];
}>;

export type GetPaymentHistoryQuery = {
  __typename?: 'Query';
  getPaymentHistory: {
    __typename?: 'UserPaymentLog';
    message: string;
    success: boolean;
    data?: {
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
    } | null;
  };
};

export type GetPaymentHistoryListQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  limit?: InputMaybe<Scalars['Float']['input']>;
  userId?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Array<UserInvoiceFilterInput> | UserInvoiceFilterInput>;
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

export type ContactFormSubmitMutationVariables = Exact<{
  formData: ContactDataDto;
  registerInput?: InputMaybe<ContactFormRegisterInput>;
}>;

export type ContactFormSubmitMutation = {
  __typename?: 'Mutation';
  contactFormSubmit: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type RegisterUserMutationVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
}>;

export type RegisterUserMutation = {
  __typename?: 'Mutation';
  registerUser: { __typename?: 'Response'; message: string; success: boolean };
};

export type UpdateEndUserDetailMutationVariables = Exact<{
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateEndUserDetailMutation = {
  __typename?: 'Mutation';
  updateEndUserDetail: {
    __typename?: 'UpdateEndUser';
    message: string;
    success: boolean;
    data: {
      __typename?: 'EndUser';
      id: string;
      firstName?: string | null;
      lastName?: string | null;
      location?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
    };
  };
};

export type UpdateDealerMutationVariables = Exact<{
  dealerId?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateDealerMutation = {
  __typename?: 'Mutation';
  updateDealer: {
    __typename?: 'UpdateDealer';
    message: string;
    success: boolean;
    data: {
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
    };
  };
};

export type RegisterDealerWithPhoneNumberViaOtpMutationVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
}>;

export type RegisterDealerWithPhoneNumberViaOtpMutation = {
  __typename?: 'Mutation';
  registerDealerWithPhoneNumberViaOtp: {
    __typename?: 'Response';
    message: string;
    success: boolean;
  };
};

export type VerifyRazorpayPaymentForEndUserMutationVariables = Exact<{
  razorpayOrderId: Scalars['String']['input'];
  razorpayPaymentId: Scalars['String']['input'];
  razorpaySignature: Scalars['String']['input'];
}>;

export type VerifyRazorpayPaymentForEndUserMutation = {
  __typename?: 'Mutation';
  verifyRazorpayPaymentForEndUser: {
    __typename?: 'UserPaymentVerification';
    message: string;
    success: boolean;
    data: { __typename?: 'Data'; paymentId: string };
  };
};

export type VerifyLoginPhoneOtpMutationVariables = Exact<{
  phoneNumber: Scalars['String']['input'];
  otp: Scalars['String']['input'];
}>;

export type VerifyLoginPhoneOtpMutation = {
  __typename?: 'Mutation';
  verifyLoginPhoneOtp: {
    __typename?: 'VerifyRegistrationWithPhoneNumber';
    message: string;
    success: boolean;
    dealerId?: string | null;
    signInToken?: {
      __typename?: 'Token';
      accessToken: string;
      refreshToken: string;
    } | null;
  };
};

export const GetCarDetailUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarDetailUser' },
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
            name: { kind: 'Name', value: 'getCarDetailUser' },
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
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'lead' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'products' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
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
                              name: { kind: 'Name', value: 'discountedAmount' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
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
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'fileType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'id' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'productType' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'thumbnail' },
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
  GetCarDetailUserQuery,
  GetCarDetailUserQueryVariables
>;
export const GetCarsUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetCarsUser' },
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
            name: { kind: 'Name', value: 'getCarsUser' },
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
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'documents' },
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
                                    name: { kind: 'Name', value: 'fileName' },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'id' },
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
                      { kind: 'Field', name: { kind: 'Name', value: 'lead' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'userId' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'updatedAt' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'createdAt' },
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
} as unknown as DocumentNode<GetCarsUserQuery, GetCarsUserQueryVariables>;
export const CreateOrderForEndUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateOrderForEndUser' },
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
            name: { kind: 'Name', value: 'bundleId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'products' },
          },
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
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createOrderForEndUser' },
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
                name: { kind: 'Name', value: 'bundleId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'bundleId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'products' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'products' },
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
                  name: { kind: 'Name', value: 'order' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'entity' },
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
                        name: { kind: 'Name', value: 'description' },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'order_id' },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'theme' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'color' },
                            },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'prefill' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'name' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'email' },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'contact' },
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
  CreateOrderForEndUserMutation,
  CreateOrderForEndUserMutationVariables
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
export const GetContactDataDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetContactData' },
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
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getContactData' },
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
} as unknown as DocumentNode<GetContactDataQuery, GetContactDataQueryVariables>;
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
export const GetUserDetailsDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetUserDetails' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getUserDetails' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'firstName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'lastName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'email' } },
                { kind: 'Field', name: { kind: 'Name', value: 'phoneNumber' } },
                { kind: 'Field', name: { kind: 'Name', value: 'location' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetUserDetailsQuery, GetUserDetailsQueryVariables>;
export const CustomerLoginWithPhoneOtpDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CustomerLoginWithPhoneOtp' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'phoneNumber' },
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
            name: { kind: 'Name', value: 'customerLoginWithPhoneOtp' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'phoneNumber' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'phoneNumber' },
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
  CustomerLoginWithPhoneOtpMutation,
  CustomerLoginWithPhoneOtpMutationVariables
>;
export const GetPaymentHistoryDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPaymentHistory' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'paymentId' },
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
            name: { kind: 'Name', value: 'getPaymentHistory' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'paymentId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'paymentId' },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  GetPaymentHistoryQuery,
  GetPaymentHistoryQueryVariables
>;
export const GetPaymentHistoryListDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'GetPaymentHistoryList' },
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
            name: { kind: 'Name', value: 'userId' },
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
                name: { kind: 'Name', value: 'limit' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'limit' },
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
  GetPaymentHistoryListQuery,
  GetPaymentHistoryListQueryVariables
>;
export const ContactFormSubmitDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'ContactFormSubmit' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'formData' },
          },
          type: {
            kind: 'NonNullType',
            type: {
              kind: 'NamedType',
              name: { kind: 'Name', value: 'ContactDataDTO' },
            },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'registerInput' },
          },
          type: {
            kind: 'NamedType',
            name: { kind: 'Name', value: 'ContactFormRegisterInput' },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'contactFormSubmit' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'formData' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'formData' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'registerInput' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'registerInput' },
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
  ContactFormSubmitMutation,
  ContactFormSubmitMutationVariables
>;
export const RegisterUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RegisterUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'phoneNumber' },
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
            name: { kind: 'Name', value: 'firstName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'lastName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'registerUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'phoneNumber' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'phoneNumber' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'firstName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'firstName' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lastName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'lastName' },
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
  RegisterUserMutation,
  RegisterUserMutationVariables
>;
export const UpdateEndUserDetailDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateEndUserDetail' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'firstName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'lastName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'location' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateEndUserDetail' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'firstName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'firstName' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lastName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'lastName' },
                },
              },
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
                name: { kind: 'Name', value: 'location' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'location' },
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
                        name: { kind: 'Name', value: 'location' },
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
  UpdateEndUserDetailMutation,
  UpdateEndUserDetailMutationVariables
>;
export const UpdateDealerDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateDealer' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'dealerId' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'firstName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'lastName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'companyName' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'location' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'email' },
          },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateDealer' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'dealerId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'dealerId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'firstName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'firstName' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lastName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'lastName' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'companyName' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'companyName' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'location' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'location' },
                },
              },
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
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  UpdateDealerMutation,
  UpdateDealerMutationVariables
>;
export const RegisterDealerWithPhoneNumberViaOtpDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RegisterDealerWithPhoneNumberViaOtp' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'phoneNumber' },
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
              value: 'registerDealerWithPhoneNumberViaOtp',
            },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'phoneNumber' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'phoneNumber' },
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
  RegisterDealerWithPhoneNumberViaOtpMutation,
  RegisterDealerWithPhoneNumberViaOtpMutationVariables
>;
export const VerifyRazorpayPaymentForEndUserDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'VerifyRazorpayPaymentForEndUser' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'razorpayOrderId' },
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
            name: { kind: 'Name', value: 'razorpayPaymentId' },
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
            name: { kind: 'Name', value: 'razorpaySignature' },
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
            name: { kind: 'Name', value: 'verifyRazorpayPaymentForEndUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'razorpayOrderId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'razorpayOrderId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'razorpayPaymentId' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'razorpayPaymentId' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'razorpaySignature' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'razorpaySignature' },
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
                        name: { kind: 'Name', value: 'paymentId' },
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
  VerifyRazorpayPaymentForEndUserMutation,
  VerifyRazorpayPaymentForEndUserMutationVariables
>;
export const VerifyLoginPhoneOtpDocument = {
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'VerifyLoginPhoneOtp' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: {
            kind: 'Variable',
            name: { kind: 'Name', value: 'phoneNumber' },
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
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'otp' } },
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
            name: { kind: 'Name', value: 'verifyLoginPhoneOtp' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'phoneNumber' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'phoneNumber' },
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'otp' },
                value: {
                  kind: 'Variable',
                  name: { kind: 'Name', value: 'otp' },
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
                { kind: 'Field', name: { kind: 'Name', value: 'dealerId' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  VerifyLoginPhoneOtpMutation,
  VerifyLoginPhoneOtpMutationVariables
>;
