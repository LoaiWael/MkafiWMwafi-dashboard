import { INITIAL_BLOG_CATEGORIES, INITIAL_BLOGS } from "./constants";
import type { BlogCategory, BlogInput, BlogRecord, BlogStatus } from "./types";

let blogs: readonly BlogRecord[] = INITIAL_BLOGS;
let categories: readonly BlogCategory[] = INITIAL_BLOG_CATEGORIES;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

export function getBlogs(): readonly BlogRecord[] {
  return blogs;
}

export function getCategories(): readonly BlogCategory[] {
  return categories;
}

export function addCategory(label: string): BlogCategory {
  const trimmed = label.trim();
  if (!trimmed) {
    throw new Error("اسم التصنيف لا يمكن أن يكون فارغاً");
  }
  const existing = categories.find(
    (c) => c.label.toLowerCase() === trimmed.toLowerCase(),
  );
  if (existing) {
    return existing;
  }
  const id = `cat-${Date.now()}`;
  const newCat: BlogCategory = {
    id,
    label: trimmed,
    iconColor: "text-primary",
    isCustom: true,
  };
  categories = [...categories, newCat];
  emit();
  return newCat;
}

export function deleteCategory(idOrLabel: string): boolean {
  const prevCount = categories.length;
  categories = categories.filter(
    (c) => c.id !== idOrLabel && c.label !== idOrLabel,
  );
  if (categories.length !== prevCount) {
    emit();
    return true;
  }
  return false;
}

export function subscribeBlogs(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getBlogById(id: string | undefined): BlogRecord | undefined {
  if (!id) return undefined;
  return blogs.find((blog) => blog.id === id || blog.slug === id);
}

export function getBlogBySlug(slug: string): BlogRecord | undefined {
  return blogs.find((blog) => blog.slug === slug);
}

function nextBlogId(): string {
  const max = blogs.reduce((highest, b) => {
    const match = b.id.match(/\d+/);
    const value = match ? Number(match[0]) : 0;
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);
  return `BLG-${String(max + 1).padStart(3, "0")}`;
}

export function formatArabicDate(dateString?: string): string {
  const date = dateString ? new Date(dateString) : new Date();
  if (isNaN(date.getTime())) return dateString ?? "";
  return new Intl.DateTimeFormat("ar-SA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function estimateReadingTimeFromHtml(topics: Array<{ content: string }>): {
  minutes: number;
  label: string;
} {
  const fullText = topics
    .map((t) => t.content.replace(/<[^>]+>/g, " "))
    .join(" ");
  const words = fullText.trim().split(/\s+/).filter(Boolean).length;
  // Arabic average reading speed ~ 150-180 words per minute
  const minutes = Math.max(1, Math.ceil(words / 150));
  return {
    minutes,
    label: `${minutes} دقائق قراءة`,
  };
}

export function createBlog(input: BlogInput): BlogRecord {
  const id = input.id || nextBlogId();
  const now = new Date().toISOString().split("T")[0];
  const reading = estimateReadingTimeFromHtml(input.topics || []);

  const newBlog: BlogRecord = {
    ...input,
    id,
    slug: input.slug.trim() || `blog-${id.toLowerCase()}`,
    readingTime: input.readingTime?.trim() || reading.label,
    readingTimeMinutes: input.readingTimeMinutes || reading.minutes,
    publishedAt: input.publishedAt || now,
    updatedAt: now,
    viewsCount: input.viewsCount ?? 0,
  };

  blogs = [newBlog, ...blogs];
  emit();
  return newBlog;
}

export function updateBlog(id: string, input: Partial<BlogInput>): BlogRecord | undefined {
  const existing = blogs.find((b) => b.id === id);
  if (!existing) return undefined;

  const now = new Date().toISOString().split("T")[0];
  const updatedTopics = input.topics ?? existing.topics;
  const reading = estimateReadingTimeFromHtml(updatedTopics);

  const updatedBlog: BlogRecord = {
    ...existing,
    ...input,
    id: existing.id,
    readingTime: input.readingTime?.trim() || existing.readingTime || reading.label,
    readingTimeMinutes: input.readingTimeMinutes || existing.readingTimeMinutes || reading.minutes,
    updatedAt: now,
  };

  blogs = blogs.map((b) => (b.id === id ? updatedBlog : b));
  emit();
  return updatedBlog;
}

export function deleteBlog(id: string): boolean {
  const prevCount = blogs.length;
  blogs = blogs.filter((b) => b.id !== id);
  if (blogs.length !== prevCount) {
    emit();
    return true;
  }
  return false;
}

export function duplicateBlog(id: string): BlogRecord | undefined {
  const source = blogs.find((b) => b.id === id);
  if (!source) return undefined;

  const newId = nextBlogId();
  const now = new Date().toISOString().split("T")[0];

  const duplicated: BlogRecord = {
    ...source,
    id: newId,
    slug: `${source.slug}-copy`,
    title: `${source.title} (نسخة)`,
    status: "draft",
    viewsCount: 0,
    publishedAt: now,
    updatedAt: now,
  };

  blogs = [duplicated, ...blogs];
  emit();
  return duplicated;
}

export function toggleBlogStatus(id: string, newStatus: BlogStatus): void {
  blogs = blogs.map((b) => (b.id === id ? { ...b, status: newStatus } : b));
  emit();
}

export function toggleBlogFeatured(id: string): void {
  blogs = blogs.map((b) =>
    b.id === id ? { ...b, featured: !b.featured } : b,
  );
  emit();
}

export function resetBlogsToDefault(): void {
  blogs = INITIAL_BLOGS;
  categories = INITIAL_BLOG_CATEGORIES;
  emit();
}
