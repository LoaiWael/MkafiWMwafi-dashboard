import { z } from "zod";

export const unitOptionFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "يرجى إدخال اسم الخيار بالعربية"),
  sortOrder: z.coerce
    .number()
    .min(0, "يجب أن يكون ترتيب العرض صفراً أو أكبر")
    .default(1),
  isActive: z.boolean().default(true),
});

export type UnitOptionFormData = z.infer<typeof unitOptionFormSchema>;
