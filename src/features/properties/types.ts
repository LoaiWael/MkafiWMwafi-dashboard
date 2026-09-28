export type PropertyType = "residential" | "commercial";

export type PropertyBuildingType =
  | "building" // عمارة سكنية / تجارية
  | "villa" // فيلا
  | "commercial_center" // مجمع / مركز تجاري
  | "office_tower" // برج مكاتب
  | "compound" // مجمع سكني
  | "warehouse_complex" // مجمع مستودعات
  | "showroom_plaza"; // مجمع معارض

export type UnitType =
  | "apartment" // شقة
  | "villa" // فيلا
  | "floor" // دور
  | "studio" // استوديو
  | "office" // مكتب
  | "shop" // محل
  | "showroom" // معرض
  | "warehouse"; // مستودع

export type UnitRentalStatus = "rented" | "vacant" | "maintenance" | "reserved";

export type DeedStatus = "verified" | "electronic" | "manual" | "under_review";

export type RepresentationType = "owner" | "agent" | "authorized_representative";

export interface PropertyAgent {
  idNumber: string; // رقم هوية وكيل المالك *
  birthDate: string; // تاريخ ميلاد وكيل المالك *
  phone: string; // رقم جوال وكيل المالك *
  agencyNumber: string; // رقم الوكالة *
  agencyDate: string; // تاريخ الوكالة *
  name?: string; // اسم الوكيل (اختياري)
}

export interface PropertyCreatorAccount {
  id: string;
  name: string; // اسم صاحب الحساب المسجل
  phone: string; // رقم الجوال
  email: string; // البريد الإلكتروني
  avatarUrl?: string;
  roleLabel?: string; // e.g. "وسيط عقاري معتمد" / "مدير أملاك" / "صاحب الحساب"
  isVerified: boolean; // تم التحقق من الحساب
}

export interface PropertyOwner {
  id?: string;
  name: string; // اسم مالك العقار *
  idNumber: string; // رقم هوية المالك *
  birthDate: string; // تاريخ ميلاد المالك *
  phone: string; // رقم جوال المالك *
  iban: string; // رقم الآيبان البنكي للمالك (22 رقم) *
  hasAgent: boolean; // هل تود أن تضيف وكيل لمالك العقار؟ (نعم / لا)
  agent?: PropertyAgent; // بيانات الوكيل
  // Optional / compatibility properties
  idType?: "national_id" | "iqama" | "cr" | "gcc_id";
  idTypeLabel?: string;
  email?: string;
  representationType?: RepresentationType;
  representationTypeLabel?: string;
  verifiedViaNafath?: boolean;
}

export interface PropertyLocation {
  region: string;
  city: string;
  district: string;
  street: string;
  buildingNumber: string;
  additionalNumber: string;
  postalCode: string;
  shortAddress: string; // e.g. "RDHA3421"
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PropertyDeed {
  deedNumber: string;
  deedDate: string;
  issuerNotary: string; // e.g. "كتابة العدل الأولى بالرياض"
  deedType?: "electronic" | "paper" | "ownership" | "istihkam";
  deedTypeLabel?: string;
  status: DeedStatus;
  statusLabel: string;
  electronicDeedId?: string;
  isVerifiedWithMoj: boolean;
}

export interface PropertyUnit {
  id: string;
  unitNumber: string; // رقم الوحدة *
  name?: string;
  type: UnitType; // نوع الوحدة *
  typeLabel: string;
  buildingType?: PropertyBuildingType | string; // نوع العقار / المبنى *
  buildingTypeLabel?: string;
  floor: number | string; // رقم الطابق *
  floorLabel: string;
  areaSqm: number; // مساحة الوحدة الإجمالية تقريبا *
  roomsCount?: number; // عدد الغرف *
  livingRoomsCount?: number; // عدد الصالات *
  kitchensCount?: number; // عدد المطابخ *
  bathroomsCount?: number; // عدد دورات المياه *
  windowAcCount?: number | string; // مكيف شباك * (e.g. 0 / "لا يوجد" / 1 / 2)
  splitAcCount?: number | string; // مكيف سبليت * (e.g. 0 / "لا يوجد" / 2 / 3)
  electricityMeterNumber?: string; // رقم عداد الكهرباء (اختياري)
  waterMeterNumber?: string; // رقم عداد المياه (اختياري)
  gasMeterNumber?: string;
  furnishingStatus?: "unfurnished" | "semi_furnished" | "fully_furnished";
  furnishingStatusLabel?: string;
  rentalStatus?: UnitRentalStatus;
  rentalStatusLabel?: string;
  currentAnnualRent?: number;
  currentContractId?: string;
  currentContractNumber?: string;
  currentTenantName?: string;
  currentTenantPhone?: string;
}

export interface PropertyAmenities {
  hasElevator: boolean;
  hasParking: boolean;
  parkingSpotsCount?: number;
  hasCentralAC: boolean;
  hasSecurityCamera: boolean;
  hasSecurityGuard: boolean;
  hasFireSystem: boolean;
  waterSupplyType?: string; // e.g. "شبكة عامة"
  sewerageType?: string; // e.g. "شبكة صرف صحي"
}

export interface PropertyActivityLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  note?: string;
  type?: "info" | "success" | "warning" | "update";
}

export interface Property {
  id: string;
  code: string; // e.g. "RE-RES-001" / "re-residential-narjis"
  name: string;
  type: PropertyType;
  typeLabel: string;
  buildingType: PropertyBuildingType;
  buildingTypeLabel: string;
  propertyAgeYears: number;
  floorsCount: number;
  totalAreaSqm: number;
  description?: string;
  status: "active" | "draft" | "archived";
  statusLabel: string;
  createdAt: string;
  updatedAt: string;
  location: PropertyLocation;
  deed: PropertyDeed;
  owner: PropertyOwner;
  createdBy?: PropertyCreatorAccount;
  units: PropertyUnit[];
  amenities: PropertyAmenities;
  totalUnitsCount: number;
  rentedUnitsCount: number;
  vacantUnitsCount: number;
  activeContractsCount: number;
  totalAnnualRevenue: number;
  historyLogs?: PropertyActivityLog[];
}
