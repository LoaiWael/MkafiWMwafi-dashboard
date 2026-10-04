import { z } from "zod";

export const optionCategories = [
  "سكني",
  "تجاري",
  "صناعي/لوجستي",
  "مختلط",
] as const;

export const optionItemSchema = z.object({
  nameAr: z
    .string()
    .trim()
    .min(1, "يرجى إدخال اسم الخيار بالعربية"),
  category: z.string().optional().default(""),
  description: z.string().trim().optional().default(""),
  isActive: z.boolean().default(true),
});

export type OptionItemFormData = z.infer<typeof optionItemSchema>;

export const amenityOptionSchema = z.object({
  value: z
    .string()
    .trim()
    .min(1, "يرجى إدخال قيمة الخيار"),
});

export type AmenityOptionFormData = z.infer<typeof amenityOptionSchema>;
