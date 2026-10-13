export interface ContractsListMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from?: number;
  to?: number;
}

export interface ContractsStatisticsDto {
  total: number;
  documented: number;
  residential: number;
  commercial: number;
  feesPaid: number;
  pendingPayment: number;
}

export interface ContractsResponsePayload {
  statistics?: ContractsStatisticsDto;
  contracts?: ContractResourceDto[];
  data?: ContractResourceDto[];
  meta?: ContractsListMeta;
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
}

export interface PaginatedPayload<T> {
  data: T[];
  links?: {
    first?: string | null;
    last?: string | null;
    prev?: string | null;
    next?: string | null;
  };
  meta?: ContractsListMeta;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  meta?: ContractsListMeta;
  links?: {
    next?: string | null;
    prev?: string | null;
  };
  errors?: Record<string, string[]>;
}

export interface ContractsListParams {
  per_page?: number;
  page?: number;
  search?: string;
  status?: string;
  payment_status?: string;
  contract_type?: string;
}

export interface ContractPartyResourceDto {
  id?: number;
  role?: string; // "المؤجر" | "المستأجر" | "landlord" | "tenant" | "lessor" | "lessee" | "broker" | "agent"
  entityType?: string; // "فرد" | "منشأة" | "individual" | "company"
  userId?: number | null;
  name?: string;
  nationalId?: string | null;
  phone?: string | null;
  email?: string | null;
  dateOfBirth?: string | null;
  unifiedNumber?: string | null;
  city?: string | null;
  businessAddress?: string | null;
  companyPhone?: string | null;
  iban?: string | null;
  bankName?: string | null;
  crNumber?: string | null;
  valLicenseNumber?: string | null;
  representationType?: string | null;
  authorizationType?: string | null;
  authorizationNumber?: string | null;
  authorizationStartDate?: string | null;
  authorizationEndDate?: string | null;
  powerOfAttorneyNumber?: string | null;
  powerOfAttorneyStartDate?: string | null;
  powerOfAttorneyEndDate?: string | null;
  representativeNationalId?: string | null;
  representativeDateOfBirth?: string | null;
  verifiedViaNafath?: boolean;
  meta?: unknown;
}

export interface ContractPropertyResourceDto {
  property?: {
    id?: number;
    deedType?: string;
    deedNumber?: string;
    hijriDate?: string;
    gregorianDate?: string;
    deedImage?: string | null;
    regionId?: number;
    region?: string;
    cityId?: number;
    city?: string;
    district?: string;
    street?: string;
    buildingNumber?: string;
    postalCode?: string;
    additionalNumber?: string;
    latitude?: number | string | null;
    longitude?: number | string | null;
    isSaved?: boolean;
  };
  unit?: {
    id?: number;
    unitTypeId?: number;
    unitType?: string;
    unitNumber?: string;
    floorId?: number;
    floor?: string;
    area?: number | string;
    electricityMeter?: string;
    waterMeter?: string;
    gasMeter?: string;
    roomsCount?: number;
    bathroomsCount?: number;
    floorsCount?: number;
    floorNumber?: number | string;
    furnishingStatus?: string;
    hasElevator?: boolean;
    hasParking?: boolean;
    hasCentralAC?: boolean;
    amenities?: Array<{
      amenityId?: number;
      name?: string;
      quantity: number;
    }>;
  };
}

export interface ContractTermsResourceDto {
  id?: number;
  durationValue?: number;
  durationUnit?: string; // "سنوات" | "أشهر" | "years" | "months"
  startDate?: string;
  endDate?: string;
  paymentFrequency?: string; // "نصف سنوي" | "شهري" | "سنوي" | "ربع سنوي"
  annualRent?: number | string;
  additionalTerms?: string | null;
  autoRenewal?: boolean;
}

export interface ContractFinancialItemDto {
  id?: number;
  type?: string;
  name?: string;
  amount?: string | number;
  quantity?: number;
  taxRate?: string | number | null;
  taxAmount?: string | number;
  total?: string | number;
  metadata?: Record<string, unknown>;
}

export interface ContractFinancialQuoteDto {
  id?: number;
  annualRent?: string | number;
  documentationFee?: {
    amount: string | number;
    taxRate: string | number;
    taxAmount: string | number;
    total: string | number;
  };
  coupon?: {
    code: string;
    discount: string | number;
  } | null;
  total?: string | number;
  currency?: string;
  isLocked?: boolean;
  pricingPlanId?: number;
  couponId?: number | null;
  couponCode?: string | null;
  serviceFeeNet?: string | number;
  taxAmount?: string | number;
  discountAmount?: string | number;
  subtotal?: string | number;
  totalAmount?: string | number;
  items?: ContractFinancialItemDto[];
  calculationSnapshot?: Record<string, unknown>;
}

export interface ContractPaymentResourceDto {
  id?: number | string;
  installmentNumber?: number;
  number?: number;
  amount?: number | string;
  status?: string;
  dueDate?: string;
  paidDate?: string;
  paidAt?: string | null;
  paymentReference?: string | null;
  paymentMethod?: string;
  transactionId?: string;
}

export interface ContractDocumentResourceDto {
  id?: number;
  documentType?: string;
  url?: string;
  filePath?: string;
  fileName?: string;
  mimeType?: string;
  fileSize?: number;
  version?: number;
  uploadedBy?: number;
  createdAt?: string;
}

export interface ContractStatusHistoryDto {
  id?: number | string;
  fromStatus?: string;
  toStatus?: string;
  status?: string;
  reason?: string;
  notes?: string | null;
  createdBy?: number | string;
  changedBy?: number | string;
  createdByName?: string;
  createdAt?: string;
}

export interface ContractResourceDto {
  id: number;
  uuid: string;
  contractNumber: string;
  contractType: string;
  status: string;
  stage?: string;
  stageLabel?: string;
  isPaid?: boolean;
  ejarNumber?: string | null;
  ejarContractNumber?: string | null;
  createdBy?: number;
  parties?: ContractPartyResourceDto[];
  property?: ContractPropertyResourceDto | null;
  terms?: ContractTermsResourceDto | null;
  financial?: ContractFinancialQuoteDto | null;
  payments?: ContractPaymentResourceDto[];
  documents?: ContractDocumentResourceDto[];
  statusHistory?: ContractStatusHistoryDto[];
  createdAt: string;
  updatedAt: string;
}
