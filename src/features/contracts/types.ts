export type ContractType = "residential" | "commercial";

export type ContractStatus =
  | "certified"
  | "under_review"
  | "pending_approval"
  | "pending_payment"
  | "rejected"
  | "expired"
  | "cancelled";

export type PaymentStatus =
  | "paid"
  | "unpaid"
  | "partially_paid"
  | "refunded";

export type PaymentFrequency =
  | "annual"
  | "semi_annual"
  | "quarterly"
  | "monthly";

export type PaymentMethod =
  | "mada"
  | "visa"
  | "mastercard"
  | "apple_pay"
  | "bank_transfer"
  | "sadad";

export interface ContractOwner {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  role: "lessor" | "lessee" | "broker" | "agent";
  roleLabel: string;
  idNumber: string;
  idTypeLabel: string;
  verifiedViaNafath: boolean;
  createdAt?: string;
}

export interface ContractParty {
  name: string;
  role: "lessor" | "lessee" | "broker";
  idType: "national_id" | "iqama" | "cr" | "gcc_id";
  idTypeLabel: string;
  idNumber: string;
  phone: string;
  email: string;
  iban?: string;
  bankName?: string;
  birthDate?: string;
  crNumber?: string;
  valLicenseNumber?: string; // Broker REGA license
  representationType?: "owner" | "agent" | "authorized_representative";
  representationTypeLabel?: string;
  powerOfAttorneyNumber?: string;
  powerOfAttorneyDate?: string;
  verifiedViaNafath: boolean;
  citizenAccountEligible?: boolean;
  socialInsuranceEligible?: boolean;
}

export interface ContractProperty {
  name: string;
  type:
    | "apartment"
    | "villa"
    | "floor"
    | "room"
    | "office"
    | "shop"
    | "warehouse"
    | "showroom"
    | "building";
  typeLabel: string;
  deedNumber: string;
  deedDate: string;
  unitNumber: string;
  areaSqm: number;
  roomsCount?: number;
  bathroomsCount?: number;
  floorsCount?: number;
  floorNumber?: number | string;
  furnishingStatus?: "unfurnished" | "semi_furnished" | "fully_furnished";
  furnishingStatusLabel?: string;
  hasElevator?: boolean;
  hasParking?: boolean;
  hasCentralAC?: boolean;
  city: string;
  district: string;
  street: string;
  postalCode: string;
  buildingNumber: string;
  additionalNumber: string;
  electricityMeterNumber: string;
  waterMeterNumber: string;
  gasMeterNumber?: string;
}

export interface EjarIntegrationInfo {
  ejarContractNumber: string;
  ejarStatus: "synced_active" | "pending_sync" | "approval_waiting" | "rejected" | "terminated";
  ejarStatusLabel: string;
  ejarSyncedAt?: string;
  regaLicenseNumber: string;
  verificationQrUrl: string;
  electronicSeals: {
    rega: boolean;
    ejar: boolean;
    saudiBusinessCenter: boolean;
  };
}

export interface InstallmentItem {
  id: string;
  number: number;
  dueDate: string;
  amount: number;
  amountFormatted: string;
  status: "paid" | "pending" | "overdue";
  statusLabel: string;
  paidDate?: string;
  paymentMethod?: string;
}

export interface ContractFinancials {
  rentalAmount: number;
  rentalAmountFormatted: string;
  securityDeposit: number;
  securityDepositFormatted: string;
  serviceCharges?: number;
  serviceChargesFormatted?: string;
  platformFee: number;
  platformFeeFormatted: string;
  taxAmount: number;
  taxAmountFormatted: string;
  totalPaid: number;
  paymentFrequency: PaymentFrequency;
  paymentFrequencyLabel: string;
  paymentStatus: PaymentStatus;
  paymentStatusLabel: string;
  paymentMethod?: PaymentMethod;
  paymentMethodLabel?: string;
  transactionId?: string;
  invoicedAt?: string;
  paidAt?: string;
  installments: InstallmentItem[];
}

export interface ContractHistoryLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  note?: string;
  previousStatus?: string;
  newStatus?: string;
}

export interface Contract {
  id: string;
  contractNumber: string;
  type: ContractType;
  typeLabel: string;
  purpose?: string;
  purposeLabel?: string;
  status: ContractStatus;
  statusLabel: string;
  statusVariant: "default" | "secondary" | "outline" | "destructive" | "ghost";
  statusColorClass: string;
  startDate: string;
  endDate: string;
  durationMonths: number;
  autoRenewal?: boolean;
  createdAt: string;
  updatedAt: string;
  owner: ContractOwner;
  lessor: ContractParty;
  lessee: ContractParty;
  broker?: ContractParty;
  property: ContractProperty;
  financials: ContractFinancials;
  ejar: EjarIntegrationInfo;
  termsAndConditions: string[];
  customTerms?: string[];
  notes?: string;
  historyLogs: ContractHistoryLog[];
}
