import { z } from "zod";

export const pricingPlanSchema = z.object({
  duration: z
    .string()
    .trim()
    .min(1, "يرجى إدخال اسم مدة التوثيق"),
  durationUnit: z.enum(["months", "years"], {
    message: "يرجى اختيار الوحدة الزمنية",
  }),
  durationValue: z
    .string()
    .trim()
    .min(1, "يرجى إدخال القيمة الرقمية للمدة")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "يجب أن تكون القيمة الرقمية أكبر من الصفر",
    }),
  amount: z
    .string()
    .trim()
    .min(1, "يرجى إدخال رسوم التوثيق")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "يجب أن يكون المبلغ رقماً صالحاً وغير سالب",
    }),
  isPopular: z.boolean(),
  notes: z.string().optional(),
});

export type PricingPlanFormData = z.infer<typeof pricingPlanSchema>;
