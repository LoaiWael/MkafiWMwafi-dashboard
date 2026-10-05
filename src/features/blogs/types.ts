export type BlogStatus = "published" | "draft";

export interface BlogCategory {
  id: string;
  label: string;
  iconColor?: string;
  isCustom?: boolean;
}

export interface BlogTopic {
  id: string;
  headline: string;
  content: string; // Rich text HTML
}

export interface BlogFaq {
  id: string;
  question: string;
  answer: string;
}

export interface BlogSeo {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogImageAlt?: string;
  noIndex?: boolean;
}

export interface BlogAuthor {
  name: string;
  role: string;
  avatar?: string;
}

export interface BlogRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  bannerImage: string;
  bannerAlt?: string;
  readingTime: string; // e.g. "6 دقائق قراءة"
  readingTimeMinutes: number; // e.g. 6
  status: BlogStatus;
  featured: boolean;
  publishedAt: string; // ISO or formatted date
  updatedAt: string; // ISO or formatted date
  viewsCount: number;
  author?: BlogAuthor;
  topics: BlogTopic[];
  faqs: BlogFaq[];
  seo: BlogSeo;
}

export type BlogInput = Omit<
  BlogRecord,
  "id" | "viewsCount" | "publishedAt" | "updatedAt"
> & {
  id?: string;
  publishedAt?: string;
  updatedAt?: string;
  viewsCount?: number;
};
