export interface RegionCity {
  id: string;
  nameAr: string;
}

export interface AdministrativeRegion {
  id: string;
  nameAr: string;
  cities: RegionCity[];
}

export const REGION_ENTRY_KIND = {
  region: "region",
  city: "city",
} as const;

export type RegionEntryKind =
  (typeof REGION_ENTRY_KIND)[keyof typeof REGION_ENTRY_KIND];

export const ALL_REGIONS_FILTER = "all";

export const REGIONS_METADATA = {
  title: "المناطق والمدن",
  description:
    "إدارة المناطق الإدارية في المملكة والمدن التابعة لكل منطقة، مع البحث والتصفية وإضافة منطقة أو مدينة.",
} as const;

export const INITIAL_REGIONS: AdministrativeRegion[] = [
  {
    id: "riyadh",
    nameAr: "منطقة الرياض",
    cities: [
      { id: "riyadh-city", nameAr: "الرياض" },
      { id: "diriyah", nameAr: "الدرعية" },
      { id: "alkharj", nameAr: "الخرج" },
    ],
  },
  {
    id: "makkah",
    nameAr: "منطقة مكة المكرمة",
    cities: [
      { id: "makkah-city", nameAr: "مكة المكرمة" },
      { id: "jeddah", nameAr: "جدة" },
      { id: "taif", nameAr: "الطائف" },
    ],
  },
  {
    id: "eastern",
    nameAr: "المنطقة الشرقية",
    cities: [
      { id: "dammam", nameAr: "الدمام" },
      { id: "khobar", nameAr: "الخبر" },
      { id: "dhahran", nameAr: "الظهران" },
    ],
  },
  {
    id: "madinah",
    nameAr: "منطقة المدينة المنورة",
    cities: [
      { id: "madinah-city", nameAr: "المدينة المنورة" },
      { id: "yanbu", nameAr: "ينبع" },
    ],
  },
  {
    id: "asir",
    nameAr: "منطقة عسير",
    cities: [
      { id: "abha", nameAr: "أبها" },
      { id: "khamis", nameAr: "خميس مشيط" },
    ],
  },
];

export function formatCityCount(count: number) {
  if (count === 0) return "لا توجد مدن";
  if (count === 1) return "مدينة واحدة";
  if (count === 2) return "مدينتان";
  if (count >= 3 && count <= 10) return `${count} مدن`;
  return `${count} مدينة`;
}

export function formatRegionCount(count: number) {
  if (count === 0) return "لا توجد مناطق";
  if (count === 1) return "منطقة واحدة";
  if (count === 2) return "منطقتان";
  if (count >= 3 && count <= 10) return `${count} مناطق`;
  return `${count} منطقة`;
}

export function normalizeArabicText(text: string): string {
  if (!text) return "";
  return text
    .trim()
    .toLowerCase()
    // Remove diacritics (tashkeel)
    .replace(/[\u064B-\u065F\u0670]/g, "")
    // Remove tatweel (kashida)
    .replace(/\u0640/g, "")
    // Normalize alefs
    .replace(/[أإآٱ]/g, "ا")
    // Normalize taa marbuta to haa
    .replace(/ة/g, "ه")
    // Normalize alef maqsura to yaa
    .replace(/ى/g, "ي");
}



export function cloneRegions(regions: readonly AdministrativeRegion[]) {
  return regions.map((region) => ({
    ...region,
    cities: region.cities.map((city) => ({ ...city })),
  }));
}

export function readStoredRegions(): AdministrativeRegion[] {
  return cloneRegions(INITIAL_REGIONS);
}

function includesQuery(value: string, query: string) {
  const normValue = normalizeArabicText(value);
  const normQuery = normalizeArabicText(query);
  return normValue.includes(normQuery);
}

export function namesMatch(left: string, right: string) {
  return normalizeArabicText(left) === normalizeArabicText(right);
}

export function filterRegions(
  regions: AdministrativeRegion[],
  search: string,
  regionId: string,
) {
  const query = search.trim();
  const isSpecificRegion =
    regionId !== ALL_REGIONS_FILTER && regions.some((r) => r.id === regionId);

  return regions.filter((region) => {
    if (isSpecificRegion && region.id !== regionId) return false;
    if (!query) return true;

    return (
      includesQuery(region.nameAr, query) ||
      region.cities.some((city) => includesQuery(city.nameAr, query))
    );
  });
}
