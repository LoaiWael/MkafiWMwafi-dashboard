export const APP_SLUG = "makfiwamufi";

export const STORAGE_KEYS = {
  theme: `${APP_SLUG}.theme`,
  sidebarCollapsed: `${APP_SLUG}.sidebar-collapsed`,
  tablePageSize: `${APP_SLUG}.table.page-size`,
} as const;

export const SITE = {
  name: "مكفي وموفي",
  logo: "/logo.svg",
  tagline: "توثيق عقود الإيجار",
  email: "info@makfiwamufi.sa",
  phoneDisplay: "0504111307",
  phoneHref: "tel:+966504111307",
  workingHours:
    "من الأحد إلى الخميس، 9 صباحاً – 6 مساءً، السبت 9 صباحاً – 2 ظهراً",
} as const;

export const TITLE_TEMPLATE = "%s | مكفي وموفي";

export const DEFAULT_PAGE_SIZE = 10;

export const ROUTES = {
  home: "/",
  contracts: "/contracts",
  requests: "/requests",
  properties: "/properties",
  users: "/users",
  brokers: "/brokers",
  payments: "/payments",
  licenses: "/licenses",
  reports: "/reports",
  notifications: "/notifications",
  support: "/support",
  settings: "/settings",
} as const;
