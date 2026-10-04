import {
  Building2,
  FileText,
  SaudiRiyal,
  Store,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";

export interface OverviewStatItem {
  id: string;
  label: string;
  value: string;
  numericValue: number;
  unit?: string;
  unitIcon?: LucideIcon;
  description: string;
  href: string;
  icon: LucideIcon;
  trend: string;
  trendPositive?: boolean;
  colorScheme: "primary" | "secondary" | "tertiary";
  subMetrics: {
    label: string;
    value: string;
  }[];
}

export const OVERVIEW_STATS: OverviewStatItem[] = [
  {
    id: "residential-contracts",
    label: "العقود السكنية",
    value: "1,284",
    numericValue: 1284,
    unit: "عقد",
    description: "عقود الإيجار السكني المتوافقة مع حساب المواطن والضمان المطور.",
    href: `${ROUTES.contracts}?type=residential`,
    icon: FileText,
    trend: "+14.2% عن الشهر السابق",
    trendPositive: true,
    colorScheme: "primary",
    subMetrics: [
      { label: "موثق ونشط", value: "1,140" },
      { label: "قيد المراجعة", value: "112" },
      { label: "بانتظار السداد", value: "32" },
    ],
  },
  {
    id: "commercial-contracts",
    label: "العقود التجارية",
    value: "458",
    numericValue: 458,
    unit: "عقد",
    description: "عقود المحلات والمكاتب والمستودعات والمنشآت الصناعية.",
    href: `${ROUTES.contracts}?type=commercial`,
    icon: Store,
    trend: "+8.6% عن الشهر السابق",
    trendPositive: true,
    colorScheme: "secondary",
    subMetrics: [
      { label: "موثق ونشط", value: "394" },
      { label: "قيد المراجعة", value: "48" },
      { label: "بانتظار السداد", value: "16" },
    ],
  },
  {
    id: "properties",
    label: "العقارات والوحدات",
    value: "892",
    numericValue: 892,
    unit: "عقار",
    description: "العقارات والوحدات المسجلة المرتبطة بعقود الإيجار.",
    href: ROUTES.properties,
    icon: Building2,
    trend: "+28 عقار هذا الأسبوع",
    trendPositive: true,
    colorScheme: "primary",
    subMetrics: [
      { label: "عقارات سكنية", value: "580" },
      { label: "عقارات تجارية", value: "312" },
      { label: "وحدات سكنية", value: "640" },
      { label: "وحدات تجارية", value: "252" },
    ],
  },
  {
    id: "users",
    label: "العملاء والمستفيدون",
    value: "3,120",
    numericValue: 3120,
    unit: "مستفيد",
    description: "المؤجرون والمستأجرون والوسطاء المسجلون في المنصة.",
    href: ROUTES.users,
    icon: Users,
    trend: "+185 مستفيد جديد",
    trendPositive: true,
    colorScheme: "secondary",
    subMetrics: [
      { label: "مؤجرون", value: "1,420" },
      { label: "مستأجرون", value: "1,700" },
    ],
  },
  {
    id: "payments",
    label: "إجمالي رسوم التوثيق",
    value: "479,250",
    numericValue: 479250,
    unitIcon: SaudiRiyal,
    description: "إجمالي رسوم التوثيق المحصلة للعقود السكنية والتجارية.",
    href: ROUTES.payments,
    icon: Wallet,
    trend: "+19.4% إجمالي العمليات",
    trendPositive: true,
    colorScheme: "tertiary",
    subMetrics: [
      { label: "عقود سكنية", value: "319,716" },
      { label: "عقود تجارية", value: "159,534" },
    ],
  },
];

export type ContractStatus =
  | "certified"
  | "under_review"
  | "pending_approval"
  | "pending_payment"
  | "expired";

export interface OverviewContract {
  id: string;
  contractNumber: string;
  ejarContractId: string;
  propertyTitle: string;
  unitNumber: string;
  city: string;
  district: string;
  lessorName: string;
  lesseeName: string;
  type: "residential" | "commercial";
  typeLabel: string;
  rentalAmount: number;
  rentalAmountFormatted: string;
  status: ContractStatus;
  statusLabel: string;
  statusVariant: "default" | "secondary" | "outline" | "destructive" | "ghost";
  statusColorClass: string;
  documentedAt: string;
  documentedAtDate: string;
  durationMonths: number;
}

export const RECENT_CONTRACTS_DATA: OverviewContract[] = [
  {
    id: "cnt-001",
    contractNumber: "MKF-2026-0891",
    ejarContractId: "EJR-9842105",
    propertyTitle: "برج النخيل السكني",
    unitNumber: "شقة 14B",
    city: "الرياض",
    district: "حي الملقا",
    lessorName: "شركة المسكن للتطوير العقاري",
    lesseeName: "محمد بن فهد الشمري",
    type: "residential",
    typeLabel: "سكني",
    rentalAmount: 52000,
    rentalAmountFormatted: "52,000 ر.س",
    status: "certified",
    statusLabel: "موثق مع إيجار",
    statusVariant: "default",
    statusColorClass: "bg-tertiary-50 text-tertiary-700 border-tertiary-200 dark:bg-tertiary-950 dark:text-tertiary-300 dark:border-tertiary-800",
    documentedAt: "منذ ساعتين",
    documentedAtDate: "2026-09-27",
    durationMonths: 12,
  },
  {
    id: "cnt-002",
    contractNumber: "MKF-2026-0890",
    ejarContractId: "EJR-9842099",
    propertyTitle: "مجمع الأندلس للأعمال",
    unitNumber: "مكتب إداري 304",
    city: "جدة",
    district: "حي الروضة",
    lessorName: "مجموعة الأفق العقارية",
    lesseeName: "شركة الرؤية التقنية للبرمجيات",
    type: "commercial",
    typeLabel: "تجاري",
    rentalAmount: 145000,
    rentalAmountFormatted: "145,000 ر.س",
    status: "certified",
    statusLabel: "موثق مع إيجار",
    statusVariant: "default",
    statusColorClass: "bg-tertiary-50 text-tertiary-700 border-tertiary-200 dark:bg-tertiary-950 dark:text-tertiary-300 dark:border-tertiary-800",
    documentedAt: "منذ 4 ساعات",
    documentedAtDate: "2026-09-27",
    durationMonths: 24,
  },
  {
    id: "cnt-003",
    contractNumber: "MKF-2026-0889",
    ejarContractId: "EJR-9842074",
    propertyTitle: "عمائر الروابي السكنية",
    unitNumber: "شقة دور أول - 02",
    city: "الدمام",
    district: "حي الشاطئ",
    lessorName: "عبدالله بن إبراهيم الراشد",
    lesseeName: "فيصل بن عمر القحطاني",
    type: "residential",
    typeLabel: "سكني",
    rentalAmount: 36000,
    rentalAmountFormatted: "36,000 ر.س",
    status: "under_review",
    statusLabel: "قيد المراجعة والتدقيق",
    statusVariant: "secondary",
    statusColorClass: "bg-secondary-50 text-secondary-800 border-secondary-200 dark:bg-secondary-950 dark:text-secondary-300 dark:border-secondary-800",
    documentedAt: "منذ 6 ساعات",
    documentedAtDate: "2026-09-27",
    durationMonths: 12,
  },
  {
    id: "cnt-004",
    contractNumber: "MKF-2026-0888",
    ejarContractId: "EJR-9842061",
    propertyTitle: "سوق القادسية التجاري",
    unitNumber: "معرض تجاري 12",
    city: "الرياض",
    district: "حي الياسمين",
    lessorName: "شركة رواسي نجد الاستثمارية",
    lesseeName: "مؤسسة الغذاء المتطور للتجارة",
    type: "commercial",
    typeLabel: "تجاري",
    rentalAmount: 220000,
    rentalAmountFormatted: "220,000 ر.س",
    status: "pending_approval",
    statusLabel: "بانتظار موافقة الأطراف",
    statusVariant: "outline",
    statusColorClass: "bg-primary-50 text-primary-800 border-primary-200 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-800",
    documentedAt: "اليوم 09:30 ص",
    documentedAtDate: "2026-09-27",
    durationMonths: 36,
  },
  {
    id: "cnt-005",
    contractNumber: "MKF-2026-0887",
    ejarContractId: "EJR-9842033",
    propertyTitle: "فلل ديار السلام",
    unitNumber: "فيلا مستقلة V-08",
    city: "الخبر",
    district: "حي الحزام الذهبي",
    lessorName: "سلطان بن خالد الدوسري",
    lesseeName: "د. طارق بن عبدالمحسن العتيبي",
    type: "residential",
    typeLabel: "سكني",
    rentalAmount: 95000,
    rentalAmountFormatted: "95,000 ر.س",
    status: "certified",
    statusLabel: "موثق مع إيجار",
    statusVariant: "default",
    statusColorClass: "bg-tertiary-50 text-tertiary-700 border-tertiary-200 dark:bg-tertiary-950 dark:text-tertiary-300 dark:border-tertiary-800",
    documentedAt: "أمس",
    documentedAtDate: "2026-09-26",
    durationMonths: 12,
  },
  {
    id: "cnt-006",
    contractNumber: "MKF-2026-0886",
    ejarContractId: "EJR-9841980",
    propertyTitle: "مستودعات الخليج اللوجستية",
    unitNumber: "مستودع تخزين W-05",
    city: "جدة",
    district: "المنطقة الصناعية",
    lessorName: "شركة المستودعات الوطنية",
    lesseeName: "شركة سلاسل الإمداد السريع",
    type: "commercial",
    typeLabel: "تجاري",
    rentalAmount: 310000,
    rentalAmountFormatted: "310,000 ر.س",
    status: "pending_payment",
    statusLabel: "بانتظار سداد الرسوم",
    statusVariant: "outline",
    statusColorClass: "bg-accent-soft text-accent-dark border-accent/30 dark:bg-muted dark:text-accent-foreground",
    documentedAt: "أمس",
    documentedAtDate: "2026-09-26",
    durationMonths: 24,
  },
  {
    id: "cnt-007",
    contractNumber: "MKF-2026-0885",
    ejarContractId: "EJR-9841922",
    propertyTitle: "أبراج التيسير الفندقية السكنية",
    unitNumber: "استوديو مفروش 502",
    city: "مكة المكرمة",
    district: "حي العزيزية",
    lessorName: "مؤسسة التيسير العقارية",
    lesseeName: "أحمد بن سالم باحارث",
    type: "residential",
    typeLabel: "سكني",
    rentalAmount: 42000,
    rentalAmountFormatted: "42,000 ر.س",
    status: "certified",
    statusLabel: "موثق مع إيجار",
    statusVariant: "default",
    statusColorClass: "bg-tertiary-50 text-tertiary-700 border-tertiary-200 dark:bg-tertiary-950 dark:text-tertiary-300 dark:border-tertiary-800",
    documentedAt: "25 سبتمبر 2026",
    documentedAtDate: "2026-09-25",
    durationMonths: 12,
  },
  {
    id: "cnt-008",
    contractNumber: "MKF-2026-0884",
    ejarContractId: "EJR-9841891",
    propertyTitle: "مجمع النور الطبي والتجاري",
    unitNumber: "عيادة طبية 201",
    city: "المدينة المنورة",
    district: "حي قباء",
    lessorName: "شركة طيبة للمجمعات الطبية",
    lesseeName: "مجمع الابتسامة التخصصي",
    type: "commercial",
    typeLabel: "تجاري",
    rentalAmount: 180000,
    rentalAmountFormatted: "180,000 ر.س",
    status: "certified",
    statusLabel: "موثق مع إيجار",
    statusVariant: "default",
    statusColorClass: "bg-tertiary-50 text-tertiary-700 border-tertiary-200 dark:bg-tertiary-950 dark:text-tertiary-300 dark:border-tertiary-800",
    documentedAt: "24 سبتمبر 2026",
    documentedAtDate: "2026-09-24",
    durationMonths: 36,
  },
  {
    id: "cnt-009",
    contractNumber: "MKF-2026-0883",
    ejarContractId: "EJR-9841840",
    propertyTitle: "مجمع النرجس السكني",
    unitNumber: "شقة 08C",
    city: "الرياض",
    district: "حي النرجس",
    lessorName: "عبدالمحسن بن ناصر التميمي",
    lesseeName: "خالد بن بدر المطيري",
    type: "residential",
    typeLabel: "سكني",
    rentalAmount: 48000,
    rentalAmountFormatted: "48,000 ر.س",
    status: "under_review",
    statusLabel: "قيد المراجعة والتدقيق",
    statusVariant: "secondary",
    statusColorClass: "bg-secondary-50 text-secondary-800 border-secondary-200 dark:bg-secondary-950 dark:text-secondary-300 dark:border-secondary-800",
    documentedAt: "23 سبتمبر 2026",
    documentedAtDate: "2026-09-23",
    durationMonths: 12,
  },
  {
    id: "cnt-010",
    contractNumber: "MKF-2026-0882",
    ejarContractId: "EJR-9841810",
    propertyTitle: "مركز الأعمال المالي",
    unitNumber: "طابق كامل - دور 6",
    city: "الرياض",
    district: "حي العليا",
    lessorName: "شركة العليا القابضة للتطوير",
    lesseeName: "شركة الحلول الرقمية المتقدمة",
    type: "commercial",
    typeLabel: "تجاري",
    rentalAmount: 450000,
    rentalAmountFormatted: "450,000 ر.س",
    status: "certified",
    statusLabel: "موثق مع إيجار",
    statusVariant: "default",
    statusColorClass: "bg-tertiary-50 text-tertiary-700 border-tertiary-200 dark:bg-tertiary-950 dark:text-tertiary-300 dark:border-tertiary-800",
    documentedAt: "22 سبتمبر 2026",
    documentedAtDate: "2026-09-22",
    durationMonths: 36,
  },
];
