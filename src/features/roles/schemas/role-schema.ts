import { z } from "zod";

export const roleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "اسم الدور يجب أن يتكون من حرفين على الأقل."),
  description: z.string().trim().optional().default(""),
  permissionKeys: z
    .array(z.string())
    .min(1, "يجب تحديد صلاحية واحدة على الأقل لهذا الدور."),
});

export type RoleFormData = z.infer<typeof roleSchema>;
