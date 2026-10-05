import { z } from "zod";

/**
 * 1. Basic Info Editor Schema
 */
export const blogBasicInfoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "عنوان المقال مطلوب")
    .min(3, "عنوان المقال يجب أن يتكون من 3 أحرف على الأقل")
    .max(200, "عنوان المقال لا يجب أن يتجاوز 200 حرف"),
  slug: z
    .string()
    .trim()
    .min(1, "الرابط الدائم (Slug) مطلوب")
    .min(2, "الرابط الدائم يجب أن يتكون من حرفين على الأقل")
    .max(150, "الرابط الدائم لا يجب أن يتجاوز 150 حرفاً")
    .regex(
      /^[a-z0-9\u0621-\u064A-]+$/i,
      "الرابط الدائم يجب أن يحتوي فقط على أحرف أو أرقام أو شرطات (-) بدون مسافات أو رموز خاصة",
    ),
  description: z
    .string()
    .trim()
    .min(1, "الوصف التمهيدي للمقال مطلوب")
    .min(10, "الوصف التمهيدي يجب أن يكون 10 أحرف على الأقل")
    .max(500, "الوصف التمهيدي لا يجب أن يتجاوز 500 حرف"),
  category: z
    .string()
    .trim()
    .min(1, "يرجى اختيار أو إضافة تصنيف للمقال"),
  readingTime: z
    .string()
    .trim()
    .min(1, "وقت القراءة التقديري مطلوب"),
  status: z.enum(["published", "draft"] as const, {
    message: "يرجى تحديد حالة المقال (منشور أو مسودة)",
  }),
  featured: z.boolean().default(false),
});

export type BlogBasicInfoFormData = z.infer<typeof blogBasicInfoSchema>;

/**
 * 2. Topics & Content Editor Schema
 */
export const blogTopicSchema = z.object({
  id: z.string().min(1, "معرف المحور مطلوب"),
  headline: z
    .string()
    .trim()
    .min(1, "عنوان المحور مطلوب")
    .min(2, "عنوان المحور يجب أن يكون حرفين على الأقل")
    .max(200, "عنوان المحور لا يجب أن يتجاوز 200 حرف"),
  content: z
    .string()
    .trim()
    .min(1, "محتوى وتفاصيل المحور مطلوبة")
    .refine(
      (html) => {
        const text = html.replace(/<[^>]*>/g, "").trim();
        return text.length > 0;
      },
      {
        message: "محتوى المحور لا يمكن أن يكون فارغاً",
      },
    ),
});

export const blogTopicsSchema = z
  .array(blogTopicSchema)
  .min(1, "يجب إضافة محور واحد على الأقل لمحتوى المقال");

export type BlogTopicFormData = z.infer<typeof blogTopicSchema>;
export type BlogTopicsFormData = z.infer<typeof blogTopicsSchema>;

/**
 * 3. Banner Image Editor Schema
 */
export const blogBannerSchema = z.object({
  bannerImage: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  bannerAlt: z
    .string()
    .trim()
    .max(200, "النص البديل لا يجب أن يتجاوز 200 حرف")
    .optional()
    .or(z.literal("")),
});

export type BlogBannerFormData = z.infer<typeof blogBannerSchema>;

/**
 * 4. FAQs Editor Schema
 */
export const blogFaqSchema = z.object({
  id: z.string().min(1, "معرف السؤال مطلوب"),
  question: z
    .string()
    .trim()
    .min(1, "نص السؤال مطلوب")
    .min(3, "نص السؤال يجب أن يكون 3 أحرف على الأقل")
    .max(250, "نص السؤال لا يجب أن يتجاوز 250 حرفاً"),
  answer: z
    .string()
    .trim()
    .min(1, "نص الإجابة مطلوب")
    .min(5, "نص الإجابة يجب أن يكون 5 أحرف على الأقل")
    .max(1000, "نص الإجابة لا يجب أن يتجاوز 1000 حرف"),
});

export const blogFaqsSchema = z.array(blogFaqSchema);

export type BlogFaqFormData = z.infer<typeof blogFaqSchema>;
export type BlogFaqsFormData = z.infer<typeof blogFaqsSchema>;

/**
 * 5. SEO Editor Schema
 */
export const blogSeoSchema = z.object({
  metaTitle: z
    .string()
    .trim()
    .max(100, "عنوان SEO يجب ألا يتجاوز 100 حرف")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .trim()
    .max(300, "وصف SEO يجب ألا يتجاوز 300 حرف")
    .optional()
    .or(z.literal("")),
  keywords: z
    .string()
    .trim()
    .max(300, "الكلمات الدلالية يجب ألا تتجاوز 300 حرف")
    .optional()
    .or(z.literal("")),
  canonicalUrl: z
    .string()
    .trim()
    .url("الرابط الأساسي Canonical يجب أن يكون رابطاً صالحاً")
    .optional()
    .or(z.literal("")),
  ogImage: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  ogImageAlt: z
    .string()
    .trim()
    .optional()
    .or(z.literal("")),
  noIndex: z.boolean().optional(),
});

export type BlogSeoFormData = z.infer<typeof blogSeoSchema>;

/**
 * Full Combined Blog Schema
 */
export const blogFormSchema = z.object({
  title: blogBasicInfoSchema.shape.title,
  slug: blogBasicInfoSchema.shape.slug,
  description: blogBasicInfoSchema.shape.description,
  category: blogBasicInfoSchema.shape.category,
  readingTime: blogBasicInfoSchema.shape.readingTime,
  status: blogBasicInfoSchema.shape.status,
  featured: blogBasicInfoSchema.shape.featured,
  bannerImage: blogBannerSchema.shape.bannerImage,
  bannerAlt: blogBannerSchema.shape.bannerAlt,
  topics: blogTopicsSchema,
  faqs: blogFaqsSchema,
  seo: blogSeoSchema,
});

export type BlogFormData = z.infer<typeof blogFormSchema>;
