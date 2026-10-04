import { z } from "zod";
import { REGION_ENTRY_KIND } from "../constants";

export const regionEntryKinds = [
  REGION_ENTRY_KIND.region,
  REGION_ENTRY_KIND.city,
] as const;

export const regionDialogSchema = z
  .object({
    kind: z.enum(regionEntryKinds, {
      message: "يرجى اختيار نوع الإضافة",
    }),
    regionId: z.string().optional(),
    nameAr: z
      .string()
      .trim()
      .min(2, "أدخل اسماً من حرفين على الأقل"),
  })
  .superRefine((data, ctx) => {
    if (
      data.kind === REGION_ENTRY_KIND.city &&
      (!data.regionId || !data.regionId.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["regionId"],
        message: "اختر المنطقة التي تتبعها المدينة",
      });
    }
  });

export type RegionDialogFormData = z.infer<typeof regionDialogSchema>;
