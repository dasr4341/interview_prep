import {
  CarStatus,
  UserStatus,
  TransmissionType,
  FuelType,
  Roles,
  QuotationStatus,
  LeadType,
  LeadsStatus,
  RazorpayOrderStatus,
  DocumentType,
  ProductType,
  Currency,
} from '@prisma/client';
import { DashboardReportType } from './dashboard-report.enum';
import { registerEnumType } from '@nestjs/graphql';

export const RegisterPrismaEnums = () => {
  registerEnumType(UserStatus, { name: 'UserStatus' });
  registerEnumType(CarStatus, { name: 'CarStatus' });
  registerEnumType(ProductType, { name: 'ProductType' });
  registerEnumType(TransmissionType, { name: 'TransmissionType' });
  registerEnumType(FuelType, { name: 'FuelType' });
  registerEnumType(Roles, { name: 'Roles' });
  registerEnumType(Currency, { name: 'Currency' });
  registerEnumType(DocumentType, { name: 'DocumentTypeDocumentType' });
  registerEnumType(QuotationStatus, { name: 'QuotationStatus' });
  registerEnumType(LeadType, { name: 'LeadType' });
  registerEnumType(LeadsStatus, { name: 'LeadsStatus' });
  registerEnumType(RazorpayOrderStatus, { name: 'RazorpayOrderStatus' });
  registerEnumType(DashboardReportType, { name: 'DashboardReportType' });
};
