import { z } from "zod";
import { MIN_EMPLOYEE_PASSWORD_LENGTH } from "../constants";

export const employeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل."),
  role: z
    .string()
    .trim()
    .min(1, "اختر الدور الوظيفي."),
  email: z
    .string()
    .trim()
    .min(1, "يرجى إدخال البريد الإلكتروني.")
    .email("صيغة البريد الإلكتروني غير صحيحة."),
  phone: z
    .string()
    .trim()
    .min(1, "يرجى إدخال رقم الجوال.")
    .refine((val) => /^05\d{8}$/.test(val.replace(/\s/g, "")), {
      message: "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.",
    }),
  password: z
    .string()
    .trim()
    .min(
      MIN_EMPLOYEE_PASSWORD_LENGTH,
      `كلمة المرور يجب أن تكون ${MIN_EMPLOYEE_PASSWORD_LENGTH} أحرف على الأقل.`,
    ),
  active: z.boolean(),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
