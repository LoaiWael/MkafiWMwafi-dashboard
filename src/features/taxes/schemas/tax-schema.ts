import { z } from "zod";

export const taxCategories = [
  "vat",
  "contract_tax",
  "service_fee",
  "custom",
] as const;

export const taxAppliesToOptions = [
  "all",
  "residential",
  "commercial",
] as const;

export const taxCalculationTypes = [
  "percentage",
  "fixed",
] as const;

export const taxRuleSchema = z
  .object({
    nameAr: z
      .string()
      .trim()
      .min(1, "يرجى إدخال اسم الضريبة أو الرسم"),
    category: z.enum(taxCategories, {
      message: "يرجى اختيار تصنيف البند",
    }),
    appliesTo: z.enum(taxAppliesToOptions, {
      message: "يرجى اختيار نطاق السريان",
    }),
    description: z.string().optional(),
    calculationType: z.enum(taxCalculationTypes, {
      message: "يرجى اختيار نوع الاحتساب",
    }),
    ratePercent: z
      .string()
      .trim()
      .refine(
        (val) =>
          val === "" ||
          (!isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100),
        {
          message: "يجب أن تكون النسبة المئوية رقماً بين 0 و 100",
        },
      ),
    fixedAmount: z
      .string()
      .trim()
      .refine(
        (val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0),
        {
          message: "يجب أن يكون المبلغ الثابت رقماً موجباً أو صفراً",
        },
      ),
    isExempt: z.boolean(),
    exemptionLabel: z.string().optional(),
    isActive: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.calculationType === "percentage") {
      if (!data.ratePercent || isNaN(Number(data.ratePercent))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ratePercent"],
          message: "يرجى إدخال النسبة المئوية",
        });
      }
    } else if (data.calculationType === "fixed") {
      if (!data.fixedAmount || isNaN(Number(data.fixedAmount))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["fixedAmount"],
          message: "يرجى إدخال المبلغ الثابت",
        });
      }
    }

    if (data.isExempt && (!data.exemptionLabel || !data.exemptionLabel.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["exemptionLabel"],
        message: "يرجى إدخال نص علامة الإعفاء",
      });
    }
  });

export type TaxRuleFormData = z.infer<typeof taxRuleSchema>;
