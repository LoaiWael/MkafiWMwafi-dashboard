export type ReportPeriod = "7d" | "14d" | "30d" | "month" | "all";

export type ReportContractFilter = "all" | "residential" | "commercial";

export interface DailyReportRecord {
  id: string;
  date: string; // YYYY-MM-DD
  dayName: string; // e.g. "السبت", "الأحد"
  totalContracts: number;
  residentialContracts: number;
  commercialContracts: number;
  totalRevenue: number; // SAR
  requestsCount: number;
  ejarSuccessRate: number; // percentage e.g. 98.5
  avgProcessingTimeMin: number; // in minutes
  completedCount: number;
  rejectedCount: number;
  paymentChannels: {
    mada: number;
    applePay: number;
    sadad: number;
    creditCard: number;
  };
}

export interface RegionDistributionItem {
  region: string;
  contractsCount: number;
  percentage: number;
  revenue: number;
}

export interface UnitTypeDistributionItem {
  name: string;
  category: "residential" | "commercial";
  count: number;
  percentage: number;
}

export interface PaymentMethodDistributionItem {
  method: string;
  share: number; // percentage
  amount: number; // SAR
}

export interface PaymentFrequencyDistributionItem {
  frequency: string;
  count: number;
  percentage: number;
}

export interface ReportsSummaryKPIs {
  totalContracts: number;
  contractsGrowthRate: number; // percentage e.g. +14.2
  totalRevenue: number; // SAR
  revenueGrowthRate: number; // percentage e.g. +18.5
  residentialContracts: number;
  commercialContracts: number;
  ejarSyncRate: number; // percentage e.g. 99.1
  avgProcessingMinutes: number; // e.g. 7.4
  totalRequests: number;
  completionRate: number; // e.g. 96.8
}
