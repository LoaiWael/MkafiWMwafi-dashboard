import { z } from "zod";
import { PARTY_OPTION_CATEGORIES } from "../constants";

export const partyOptionCategories = PARTY_OPTION_CATEGORIES;

export const partyOptionSchema = z.object({
  nameAr: z
    .string()
    .trim()
    .min(1, "يرجى إدخال صفة الطرف بالعربية"),
  category: z.string().optional().default("أفراد"),
  description: z.string().trim().optional().default(""),
  isActive: z.boolean().default(true),
});

export type PartyOptionFormData = z.infer<typeof partyOptionSchema>;
