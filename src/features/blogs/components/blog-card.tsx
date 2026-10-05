import { Link } from "react-router";
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  Eye,
  HelpCircle,
  Layers,
  MoreVertical,
  Sparkles,
  Tag,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatArabicDate } from "../blogs-store";
import type { BlogRecord } from "../types";

interface BlogCardProps {
  blog: BlogRecord;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (blog: BlogRecord) => void;
}

export default function BlogCard({
  blog,
  onDuplicate,
  onDelete,
  onToggleStatus,
}: BlogCardProps) {
  const isPublished = blog.status === "published";
  const topicsCount = blog.topics?.length || 0;
  const faqsCount = blog.faqs?.length || 0;

  return (
    <Card className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-card p-0 gap-0 shadow-xs transition-all duration-300 hover:border-primary-300 hover:shadow-lg">
      {/* Banner Image Container */}
      <Link
        to={`/blogs/${blog.id}`}
        className="relative block aspect-16/9 w-full overflow-hidden bg-muted"
      >
        <img
          src={blog.bannerImage}
          alt={blog.bannerAlt || blog.title}
          className="size-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = "/logo.svg";
          }}
        />

        {/* Category Pill */}
        <div className="absolute end-3 top-3 z-10">
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className="shadow-sm font-semibold"
          >
            {isPublished ? "منشور" : "مسودة"}
          </Badge>
        </div>

        {blog.featured && (
          <div className="absolute start-3 top-3 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-secondary text-secondary-foreground px-2.5 py-0.5 text-[11px] font-bold shadow-sm">
              <Sparkles className="size-3" />
              <span>مميز</span>
            </span>
          </div>
        )}

        {/* Category Badge at bottom of banner */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-t-xl border-t border-x border-border/80 bg-card px-3.5 py-1 text-[11px] font-bold text-primary-800 shadow-xs">
            <Tag className="size-3 text-secondary" />
            <span>{blog.category}</span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <CardContent className="flex flex-1 flex-col p-5 sm:p-6">
        {/* Meta info row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary-600 shrink-0" />
            <span>{formatArabicDate(blog.updatedAt || blog.publishedAt)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="size-3.5 text-secondary shrink-0" />
            <span>{blog.readingTime || "5 دقائق"}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-primary sm:text-lg line-clamp-2">
          <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
        </h3>

        {/* Description */}
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
          {blog.description}
        </p>

        {/* Stats Row */}
        <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground border-t border-border/60 pt-3">
          <span className="inline-flex items-center gap-1">
            <Layers className="size-3.5 text-primary" />
            <span>{topicsCount} محاور</span>
          </span>

          <span className="inline-flex items-center gap-1">
            <HelpCircle className="size-3.5 text-secondary" />
            <span>{faqsCount} أسئلة</span>
          </span>
        </div>

        {/* Actions Footer */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <Link
            to={`/blogs/${blog.id}`}
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "gap-1.5 text-xs text-primary font-bold hover:bg-primary-50",
            })}
          >
            <Eye className="size-3.5" />
            <span>عرض المقال</span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              to={`/blogs/${blog.id}/edit`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "gap-1 text-xs font-semibold",
              })}
            >
              <Edit className="size-3.5" />
              <span>تحرير</span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="خيارات المقال"
              >
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1 text-xs">
                <DropdownMenuItem
                  render={<Link to={`/blogs/${blog.id}`} />}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Eye className="size-4 text-primary shrink-0" />
                  <span>عرض المقال</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  render={<Link to={`/blogs/${blog.id}/edit`} />}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Edit className="size-4 text-primary shrink-0" />
                  <span>تحرير المقال</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onToggleStatus(blog)}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-secondary/10 hover:text-secondary focus:bg-secondary/10 focus:text-secondary"
                >
                  <Tag className="size-4 text-secondary shrink-0" />
                  <span>
                    {isPublished ? "تحويل إلى مسودة" : "نشر المقال"}
                  </span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onDuplicate(blog.id)}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Copy className="size-4 text-muted-foreground shrink-0" />
                  <span>تكرار كنسخة جديدة</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => onDelete(blog.id)}
                  className="gap-2 cursor-pointer font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="size-4 text-destructive shrink-0" />
                  <span>حذف المقال</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
