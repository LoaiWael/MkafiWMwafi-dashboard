import { z } from "zod";

export const propertyBuildingTypes = [
  "building",
  "villa",
  "commercial_center",
  "office_tower",
  "compound",
  "warehouse_complex",
  "showroom_plaza",
] as const;

export const unitTypes = [
  "apartment",
  "villa",
  "floor",
  "studio",
  "office",
  "shop",
  "showroom",
  "warehouse",
] as const;

export const editPropertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "يرجى إدخال اسم العقار"),
  buildingType: z.enum(propertyBuildingTypes, {
    message: "يرجى اختيار نوع المبنى",
  }),
  totalAreaSqm: z
    .string()
    .trim()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "يرجى إدخال مساحة صالحة (م²)",
    }),
  floorsCount: z
    .string()
    .trim()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "يرجى إدخال عدد أدوار صالح",
    }),
  propertyAgeYears: z
    .string()
    .trim()
    .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
      message: "يرجى إدخال عمر عقار صالح",
    }),
  description: z.string().optional(),
});

export type EditPropertyFormData = z.infer<typeof editPropertySchema>;

export const addUnitSchema = z.object({
  type: z.enum(unitTypes, {
    message: "يرجى اختيار نوع الوحدة",
  }),
  buildingType: z.string().min(1, "يرجى اختيار نوع العقار / المبنى"),
  unitNumber: z
    .string()
    .trim()
    .min(1, "يرجى إدخال رقم الوحدة"),
  floor: z
    .string()
    .trim()
    .min(1, "يرجى اختيار رقم الطابق"),
  areaSqm: z
    .string()
    .trim()
    .min(1, "يرجى إدخال مساحة الوحدة")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "يجب أن تكون المساحة رقماً أكبر من الصفر",
    }),
  roomsCount: z.string().min(1, "يرجى اختيار عدد الغرف"),
  livingRoomsCount: z.string().min(1, "يرجى اختيار عدد الصالات"),
  kitchensCount: z.string().min(1, "يرجى اختيار عدد المطابخ"),
  bathroomsCount: z.string().min(1, "يرجى اختيار عدد دورات المياه"),
  windowAcCount: z.string().min(1, "يرجى تحديد مكيف الشباك"),
  splitAcCount: z.string().min(1, "يرجى تحديد مكيف السبليت"),
  electricityMeterNumber: z.string().optional(),
  waterMeterNumber: z.string().optional(),
});

export type AddUnitFormData = z.infer<typeof addUnitSchema>;
