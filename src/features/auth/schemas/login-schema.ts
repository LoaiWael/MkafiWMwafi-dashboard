import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "يرجى إدخال البريد الإلكتروني أو رقم الجوال"),
  password: z
    .string()
    .min(1, "يرجى إدخال كلمة المرور")
    .min(6, "يجب ألا تقل كلمة المرور عن 6 خانات"),
  rememberMe: z.boolean(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
