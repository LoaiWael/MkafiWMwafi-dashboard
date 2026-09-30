export type TwitterCard = "summary" | "summary_large_image";

export interface PageSeo {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: string;
  indexable: boolean;
  followLinks: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageAlt: string;
  twitterCard: TwitterCard;
  mirrorOpenGraph: boolean;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}
