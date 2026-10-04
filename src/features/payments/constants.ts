export interface PaymentFrequencyOption {
  id: string;
  nameAr: string;
  installmentCount: number;
  periodAr: string;
  description: string;
  isActive: boolean;
}

export type PaymentRecordStatus = "completed" | "pending" | "failed";
export type PaymentRecordType = "contract_certification" | "rent_installment" | "security_deposit" | "platform_fee";
export type PaymentMethodType = "mada" | "apple_pay" | "visa" | "mastercard" | "sadad" | "bank_transfer";
export type ContractType = "residential" | "commercial";

export interface PaymentPayer {
  id?: string;
  name: string;
  phone: string;
  nationalId: string;
  role: "lessor" | "lessee" | "broker";
  roleLabel: string;
  email?: string;
}

export interface PaymentProperty {
  name: string;
  unitNumber: string;
  typeLabel: string;
  city: string;
  district: string;
  deedNumber: string;
}

export interface PaymentReportRecord {
  id: string;
  transactionNumber: string;
  invoiceNumber: string;
  contractId: string;
  contractNumber: string;
  contractType: ContractType;
  contractTypeLabel: string;
  ejarNumber: string;
  payer: PaymentPayer;
  property: PaymentProperty;
  paymentType: PaymentRecordType;
  paymentTypeLabel: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  paymentMethod: PaymentMethodType;
  paymentMethodLabel: string;
  status: PaymentRecordStatus;
  statusLabel: string;
  createdAt: string;
  paidAt?: string;
  gatewayRef?: string;
  bankReference?: string;
  notes?: string;
}

export const INITIAL_PAYMENT_FREQUENCIES: PaymentFrequencyOption[] = [
  {
    id: "annual_1",
    nameAr: "دفعة واحدة (سنوي)",
    installmentCount: 1,
    periodAr: "سنوي",
    description: "سداد قيمة الإيجار بالكامل في دفعة واحدة سنوياً",
    isActive: true,
  },
  {
    id: "semi_annual_2",
    nameAr: "دفعتان (نصف سنوي)",
    installmentCount: 2,
    periodAr: "كل 6 أشهر",
    description: "سداد الإيجار على دفعتين متساويتين كل 6 أشهر",
    isActive: true,
  },
  {
    id: "quarterly_4",
    nameAr: "4 دفعات (ربع سنوي)",
    installmentCount: 4,
    periodAr: "كل 3 أشهر",
    description: "سداد الإيجار على 4 دفعات ربع سنوية",
    isActive: true,
  },
  {
    id: "monthly_12",
    nameAr: "12 دفعة (شهري)",
    installmentCount: 12,
    periodAr: "شهرياً",
    description: "سداد الإيجار شهرياً على 12 دفعة طوال السنة",
    isActive: true,
  },
];

export const MOCK_PAYMENT_REPORTS: PaymentReportRecord[] = [
  {
    id: "pay-101",
    transactionNumber: "TXN-84920194",
    invoiceNumber: "INV-2026-00412",
    contractId: "cnt-001",
    contractNumber: "EJ-2026-0842",
    contractType: "residential",
    contractTypeLabel: "عقد سكني",
    ejarNumber: "EJAR-2026-99214",
    payer: {
      id: "usr-creator-default",
      name: "محمد بن فهد الشمري",
      phone: "0559876543",
      nationalId: "1089234123",
      role: "lessee",
      roleLabel: "المستأجر",
      email: "m.shammari@gmail.com",
    },
    property: {
      name: "برج النخيل السكني",
      unitNumber: "شقة 14B",
      typeLabel: "شقة سكنية فاخرة",
      city: "الرياض",
      district: "حي الملقا",
      deedNumber: "310124009812",
    },
    paymentType: "contract_certification",
    paymentTypeLabel: "توثيق عقد إيجار",
    amount: 125,
    taxAmount: 18.75,
    totalAmount: 143.75,
    currency: "ر.س",
    paymentMethod: "mada",
    paymentMethodLabel: "مدى (Mada)",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-28 14:32",
    paidAt: "2026-09-28 14:33",
    gatewayRef: "MADA_AUTH_981240",
    bankReference: "RAJHI_9012348",
    notes: "سداد رسوم التوثيق الإلكتروني المعتمد لدى شبكة إيجار.",
  },
  {
    id: "pay-102",
    transactionNumber: "TXN-84920195",
    invoiceNumber: "INV-2026-00413",
    contractId: "cnt-002",
    contractNumber: "EJ-2026-0843",
    contractType: "commercial",
    contractTypeLabel: "عقد تجاري",
    ejarNumber: "EJAR-2026-99215",
    payer: {
      id: "usr-002",
      name: "عبدالله بن سلمان القحطاني",
      phone: "0501234567",
      nationalId: "1010987654",
      role: "lessee",
      roleLabel: "المستأجر (مفوض)",
      email: "a.qahtani@alqahtani-co.sa",
    },
    property: {
      name: "مجمع العليا التجاري",
      unitNumber: "مكتب 302",
      typeLabel: "مكتب إداري",
      city: "الرياض",
      district: "حي العليا",
      deedNumber: "310189004521",
    },
    paymentType: "rent_installment",
    paymentTypeLabel: "الدفعة الإيجارية الأولى",
    amount: 45000,
    taxAmount: 0,
    totalAmount: 45000,
    currency: "ر.س",
    paymentMethod: "sadad",
    paymentMethodLabel: "سداد (Sadad)",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-28 11:15",
    paidAt: "2026-09-28 11:20",
    gatewayRef: "SADAD_REF_8812904",
    bankReference: "NCB_7719203",
    notes: "سداد الدفعة النصف سنوية الأولى عبر نظام سداد المباشر.",
  },
  {
    id: "pay-103",
    transactionNumber: "TXN-84920196",
    invoiceNumber: "INV-2026-00414",
    contractId: "cnt-003",
    contractNumber: "EJ-2026-0844",
    contractType: "residential",
    contractTypeLabel: "عقد سكني",
    ejarNumber: "EJAR-2026-99216",
    payer: {
      id: "usr-003",
      name: "سارة بنت خالد الدوسري",
      phone: "0543322110",
      nationalId: "1076543210",
      role: "lessee",
      roleLabel: "المستأجرة",
      email: "sara.dossary@outlook.com",
    },
    property: {
      name: "فلل الياسمين السكنية",
      unitNumber: "فيلا 4",
      typeLabel: "فيلا مستقلة دورين",
      city: "الرياض",
      district: "حي الياسمين",
      deedNumber: "310245008912",
    },
    paymentType: "security_deposit",
    paymentTypeLabel: "مبلغ التأمين المسترد",
    amount: 5000,
    taxAmount: 0,
    totalAmount: 5000,
    currency: "ر.س",
    paymentMethod: "apple_pay",
    paymentMethodLabel: "Apple Pay",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-27 19:40",
    paidAt: "2026-09-27 19:41",
    gatewayRef: "APAY_TRX_4401923",
    bankReference: "ALBILAD_330192",
    notes: "مبلغ تأمين المحافظة على الوحدة محفوظ في حساب الضمان.",
  },
  {
    id: "pay-104",
    transactionNumber: "TXN-84920197",
    invoiceNumber: "INV-2026-00415",
    contractId: "cnt-004",
    contractNumber: "EJ-2026-0845",
    contractType: "commercial",
    contractTypeLabel: "عقد تجاري",
    ejarNumber: "EJAR-2026-99217",
    payer: {
      id: "usr-004",
      name: "شركة الرؤية المتطورة للاستثمار",
      phone: "0567788990",
      nationalId: "1010654321",
      role: "lessor",
      roleLabel: "المؤجر",
      email: "finance@alroya.sa",
    },
    property: {
      name: "مركز الشاطئ للأعمال",
      unitNumber: "معرض 12",
      typeLabel: "معرض تجاري رئيسي",
      city: "جدة",
      district: "حي الشاطئ",
      deedNumber: "420199003112",
    },
    paymentType: "contract_certification",
    paymentTypeLabel: "توثيق عقد إيجار",
    amount: 200,
    taxAmount: 30,
    totalAmount: 230,
    currency: "ر.س",
    paymentMethod: "visa",
    paymentMethodLabel: "فيزا / ماستركارد",
    status: "pending",
    statusLabel: "قيد المعالجة",
    createdAt: "2026-09-27 16:10",
    gatewayRef: "TAP_PEND_771920",
    notes: "بانتظار تأكيد بوابة الدفع البنكية وإشعار الاعتماد.",
  },
  {
    id: "pay-105",
    transactionNumber: "TXN-84920198",
    invoiceNumber: "INV-2026-00416",
    contractId: "cnt-005",
    contractNumber: "EJ-2026-0846",
    contractType: "residential",
    contractTypeLabel: "عقد سكني",
    ejarNumber: "EJAR-2026-99218",
    payer: {
      id: "usr-005",
      name: "خالد بن عبدالعزيز العتيبي",
      phone: "0554433221",
      nationalId: "1032145698",
      role: "lessee",
      roleLabel: "المستأجر",
      email: "k.otaibi@hotmail.com",
    },
    property: {
      name: "عمارة الأندلس السكنية",
      unitNumber: "شقة 6",
      typeLabel: "شقة عائلية 3 غرف",
      city: "الدمام",
      district: "حي الشاطئ الغربي",
      deedNumber: "210455001234",
    },
    paymentType: "rent_installment",
    paymentTypeLabel: "الدفعة الإيجارية الربع سنوية",
    amount: 9500,
    taxAmount: 0,
    totalAmount: 9500,
    currency: "ر.س",
    paymentMethod: "mada",
    paymentMethodLabel: "مدى (Mada)",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-26 10:20",
    paidAt: "2026-09-26 10:22",
    gatewayRef: "MADA_AUTH_661923",
    bankReference: "INMA_551902",
  },
  {
    id: "pay-106",
    transactionNumber: "TXN-84920199",
    invoiceNumber: "INV-2026-00417",
    contractId: "cnt-006",
    contractNumber: "EJ-2026-0847",
    contractType: "commercial",
    contractTypeLabel: "عقد تجاري",
    ejarNumber: "EJAR-2026-99219",
    payer: {
      id: "usr-006",
      name: "مؤسسة البناء الحديث للمقاولات",
      phone: "0509988776",
      nationalId: "1010332211",
      role: "lessee",
      roleLabel: "المستأجر",
      email: "contact@modern-build.sa",
    },
    property: {
      name: "مستودعات المشاعل اللوجستية",
      unitNumber: "مستودع H-4",
      typeLabel: "مستودع صناعي وتخزين",
      city: "الرياض",
      district: "حي المشاعل",
      deedNumber: "310992004455",
    },
    paymentType: "rent_installment",
    paymentTypeLabel: "الدفعة الإيجارية الأولى",
    amount: 60000,
    taxAmount: 0,
    totalAmount: 60000,
    currency: "ر.س",
    paymentMethod: "bank_transfer",
    paymentMethodLabel: "حوالة بنكية مباشرة",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-25 15:45",
    paidAt: "2026-09-25 16:30",
    bankReference: "SNB_REF_9918234",
    notes: "تمت مطابقة الإشعار البنكي واعتماد الإيداع في حساب المؤسسة.",
  },
  {
    id: "pay-107",
    transactionNumber: "TXN-84920200",
    invoiceNumber: "INV-2026-00418",
    contractId: "cnt-007",
    contractNumber: "EJ-2026-0848",
    contractType: "residential",
    contractTypeLabel: "عقد سكني",
    ejarNumber: "EJAR-2026-99220",
    payer: {
      id: "usr-007",
      name: "أحمد بن إبراهيم المنصور",
      phone: "0531122334",
      nationalId: "1045678912",
      role: "lessee",
      roleLabel: "المستأجر",
      email: "a.mansoor@gmail.com",
    },
    property: {
      name: "مجمع ديار الروضة",
      unitNumber: "شقة 203",
      typeLabel: "شقة سكنية 4 غرف",
      city: "جدة",
      district: "حي الروضة",
      deedNumber: "420334001928",
    },
    paymentType: "contract_certification",
    paymentTypeLabel: "توثيق عقد إيجار",
    amount: 125,
    taxAmount: 18.75,
    totalAmount: 143.75,
    currency: "ر.س",
    paymentMethod: "apple_pay",
    paymentMethodLabel: "Apple Pay",
    status: "failed",
    statusLabel: "فاشلة / ملغاة",
    createdAt: "2026-09-25 12:05",
    gatewayRef: "APAY_FAIL_DECLINED",
    notes: "تم رفض العملية من البنك المصدر للبطاقة لعدم كفاية الرصيد.",
  },
  {
    id: "pay-108",
    transactionNumber: "TXN-84920201",
    invoiceNumber: "INV-2026-00419",
    contractId: "cnt-008",
    contractNumber: "EJ-2026-0849",
    contractType: "residential",
    contractTypeLabel: "عقد سكني",
    ejarNumber: "EJAR-2026-99221",
    payer: {
      id: "usr-008",
      name: "نورة بنت ناصر السبيعي",
      phone: "0556677889",
      nationalId: "1098765432",
      role: "lessee",
      roleLabel: "المستأجرة",
      email: "noura.subaie@yahoo.com",
    },
    property: {
      name: "أبراج التحلية السكنية",
      unitNumber: "شقة 801",
      typeLabel: "شقة استوديو فاخرة",
      city: "الخبر",
      district: "حي العليا",
      deedNumber: "230114008819",
    },
    paymentType: "contract_certification",
    paymentTypeLabel: "توثيق عقد إيجار",
    amount: 125,
    taxAmount: 18.75,
    totalAmount: 143.75,
    currency: "ر.س",
    paymentMethod: "mada",
    paymentMethodLabel: "مدى (Mada)",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-24 09:30",
    paidAt: "2026-09-24 09:32",
    gatewayRef: "MADA_AUTH_331902",
    bankReference: "RAJHI_REF_11209",
    notes: "سداد رسوم توثيق العقد الإلكتروني بنجاح.",
  },
  {
    id: "pay-109",
    transactionNumber: "TXN-84920202",
    invoiceNumber: "INV-2026-00420",
    contractId: "cnt-009",
    contractNumber: "EJ-2026-0850",
    contractType: "commercial",
    contractTypeLabel: "عقد تجاري",
    ejarNumber: "EJAR-2026-99222",
    payer: {
      id: "usr-009",
      name: "شركة أفق المستقبل العقارية",
      phone: "0507766554",
      nationalId: "1010887766",
      role: "broker",
      roleLabel: "الوسيط العقاري المعتمد",
      email: "finance@ofoq-future.sa",
    },
    property: {
      name: "مجمع أبراج النور",
      unitNumber: "معرض 2A",
      typeLabel: "صالة عرض تجارية",
      city: "مكة المكرمة",
      district: "حي العزيزية",
      deedNumber: "110449007712",
    },
    paymentType: "platform_fee",
    paymentTypeLabel: "رسوم وخدمات الوساطة",
    amount: 1500,
    taxAmount: 225,
    totalAmount: 1725,
    currency: "ر.س",
    paymentMethod: "visa",
    paymentMethodLabel: "فيزا / ماستركارد",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-23 18:15",
    paidAt: "2026-09-23 18:17",
    gatewayRef: "VISA_AUTH_554190",
    bankReference: "ALJAZIRA_881902",
    notes: "سداد رسوم الخدمة الإدارية وتوثيق عقد الوساطة العقارية المعتمد.",
  },
  {
    id: "pay-110",
    transactionNumber: "TXN-84920203",
    invoiceNumber: "INV-2026-00421",
    contractId: "cnt-010",
    contractNumber: "EJ-2026-0851",
    contractType: "residential",
    contractTypeLabel: "عقد سكني",
    ejarNumber: "EJAR-2026-99223",
    payer: {
      id: "usr-010",
      name: "سلطان بن صالح الزهراني",
      phone: "0552233445",
      nationalId: "1065432198",
      role: "lessee",
      roleLabel: "المستأجر",
      email: "sultan.zahrani@gmail.com",
    },
    property: {
      name: "عمارة النرجس ريزيدنس",
      unitNumber: "شقة 102",
      typeLabel: "شقة سكنية مؤثثة",
      city: "الرياض",
      district: "حي النرجس",
      deedNumber: "310558002934",
    },
    paymentType: "rent_installment",
    paymentTypeLabel: "الدفعة الإيجارية الشهرية",
    amount: 4200,
    taxAmount: 0,
    totalAmount: 4200,
    currency: "ر.س",
    paymentMethod: "mada",
    paymentMethodLabel: "مدى (Mada)",
    status: "completed",
    statusLabel: "ناجحة ومكتملة",
    createdAt: "2026-09-23 14:00",
    paidAt: "2026-09-23 14:02",
    gatewayRef: "MADA_AUTH_901284",
    bankReference: "NCB_6601923",
  },
];

export const PAYMENTS_METADATA = {
  title: "المدفوعات والبيانات المالية",
  description:
    "سجل وتقارير مدفوعات العقود والعمليات المالية مع إدارة خيارات وتكرار الدفعات المعتمدة.",
} as const;
