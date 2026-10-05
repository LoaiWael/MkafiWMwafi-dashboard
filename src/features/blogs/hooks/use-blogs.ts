import { useSyncExternalStore } from "react";
import {
  getBlogs,
  getCategories,
  subscribeBlogs,
} from "../blogs-store";
import type { BlogCategory, BlogRecord } from "../types";

export function useBlogs(): readonly BlogRecord[] {
  return useSyncExternalStore(subscribeBlogs, getBlogs, getBlogs);
}

export function useBlogCategories(): readonly BlogCategory[] {
  return useSyncExternalStore(subscribeBlogs, getCategories, getCategories);
}

export function useBlog(id: string | undefined): BlogRecord | undefined {
  const blogs = useBlogs();
  if (!id) return undefined;
  return blogs.find((blog) => blog.id === id || blog.slug === id);
}
