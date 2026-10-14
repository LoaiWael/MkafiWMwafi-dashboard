import { z } from "zod";

export const couponDiscountTypes = ["percentage", "fixed"] as const;
export const couponStatuses = [
  "active",
  "scheduled",
  "expired",
  "inactive",
] as const;
export const targetServicesList = ["all", "residential", "commercial"] as const;
export const targetUserTypes = [
  "all",
  "individual",
  "broker",
  "company",
] as const;

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(1, "رمز الكوبون مطلوب")
      .min(3, "رمز الكوبون يجب أن يكون 3 أحرف على الأقل"),
    name: z.string().trim().min(1, "اسم الكوبون مطلوب"),
    description: z.string().optional(),
    discountType: z.enum(couponDiscountTypes),
    discountValue: z
      .string()
      .trim()
      .min(1, "قيمة الخصم مطلوبة")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "قيمة الخصم يجب أن تكون أكبر من الصفر",
      }),
    maxDiscountAmount: z
      .string()
      .trim()
      .optional()
      .refine(
        (val) => !val || (!isNaN(Number(val)) && Number(val) > 0),
        { message: "الحد الأقصى للخصم يجب أن يكون أكبر من الصفر" }
      ),
    minOrderAmount: z
      .string()
      .trim()
      .refine((val) => val === "" || (!isNaN(Number(val)) && Number(val) >= 0), {
        message: "الحد الأدنى لا يمكن أن يكون سالباً",
      }),
    targetServices: z
      .array(z.enum(targetServicesList))
      .min(1, "يجب تحديد نوع العقود المشمولة بالخصم"),
    hasUsageLimit: z.boolean(),
    usageLimitTotal: z.string().optional(),
    usageLimitPerUser: z
      .string()
      .trim()
      .min(1, "حدد الحد الأقصى لكل مستخدم")
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 1, {
        message: "الحد الأقصى لكل مستخدم يجب أن يكون 1 على الأقل",
      }),
    status: z.enum(couponStatuses),
    startDate: z.string().min(1, "تاريخ بدء الصلاحية مطلوب"),
    endDate: z.string().min(1, "تاريخ انتهاء الصلاحية مطلوب"),
    isPublic: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.discountType === "percentage") {
      const numVal = Number(data.discountValue);
      if (!isNaN(numVal) && numVal > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["discountValue"],
          message: "نسبة الخصم لا يمكن أن تتجاوز 100%",
        });
      }
    }

    if (data.startDate && data.endDate) {
      if (data.endDate < data.startDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["endDate"],
          message: "تاريخ انتهاء الصلاحية لا يمكن أن يكون قبل تاريخ بدء الصلاحية",
        });
      }
    }

    if (data.hasUsageLimit && data.usageLimitTotal && data.usageLimitTotal.trim() !== "") {
      const total = Number(data.usageLimitTotal);
      if (isNaN(total) || total < 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["usageLimitTotal"],
          message: "الحد الإجمالي يجب أن يكون 1 على الأقل",
        });
      }
    }
  });

export type CouponFormData = z.infer<typeof couponSchema>;
