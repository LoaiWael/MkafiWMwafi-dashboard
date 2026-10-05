import { Link } from "react-router";
import {
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
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatArabicDate } from "../blogs-store";
import type { BlogRecord } from "../types";

interface BlogsTableProps {
  blogs: readonly BlogRecord[];
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (blog: BlogRecord) => void;
}

export default function BlogsTable({
  blogs,
  onDuplicate,
  onDelete,
  onToggleStatus,
}: BlogsTableProps) {
  const columns: DataTableColumn<BlogRecord>[] = [
    {
      id: "title",
      header: "المقال",
      accessorKey: "title",
      sortable: true,
      minWidth: "300px",
      cell: (blog) => (
        <div className="flex items-center gap-3">
          <Link
            to={`/blogs/${blog.id}`}
            className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-muted border border-border group"
          >
            <img
              src={blog.bannerImage}
              alt={blog.title}
              className="size-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/logo.svg";
              }}
            />
          </Link>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Link
                to={`/blogs/${blog.id}`}
                className="text-xs font-bold text-foreground hover:text-primary transition-colors line-clamp-1 sm:text-sm"
              >
                {blog.title}
              </Link>
              {blog.featured && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-secondary-foreground shadow-xs">
                  <Sparkles className="size-2.5" />
                  <span>مميز</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground line-clamp-1">
              {blog.description}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "category",
      header: "التصنيف",
      accessorKey: "category",
      sortable: true,
      minWidth: "140px",
      cell: (blog) => (
        <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-xs font-semibold text-primary-800">
          <Tag className="size-3 text-secondary" />
          <span>{blog.category}</span>
        </span>
      ),
    },
    {
      id: "status",
      header: "الحالة",
      accessorKey: "status",
      sortable: true,
      minWidth: "110px",
      cell: (blog) => {
        const isPublished = blog.status === "published";
        return (
          <Badge
            variant={isPublished ? "default" : "secondary"}
            className="text-xs font-semibold"
          >
            {isPublished ? "منشور" : "مسودة"}
          </Badge>
        );
      },
    },
    {
      id: "content",
      header: "المحاور والأسئلة",
      minWidth: "140px",
      cell: (blog) => (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1 font-medium">
            <Layers className="size-3.5 text-primary" />
            <span>{blog.topics?.length || 0}</span>
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-medium">
            <HelpCircle className="size-3.5 text-secondary" />
            <span>{blog.faqs?.length || 0}</span>
          </span>
        </div>
      ),
    },
    {
      id: "readingTime",
      header: "وقت القراءة",
      minWidth: "120px",
      cell: (blog) => (
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3.5 text-secondary" />
          <span>{blog.readingTime || "5 دقائق"}</span>
        </span>
      ),
    },
    {
      id: "date",
      header: "تاريخ النشر / التحديث",
      minWidth: "150px",
      sortable: true,
      sortValue: (b) => new Date(b.updatedAt || b.publishedAt || "").getTime(),
      cell: (blog) => (
        <span className="text-xs text-muted-foreground">
          {formatArabicDate(blog.updatedAt || blog.publishedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      minWidth: "120px",
      align: "center",
      cell: (blog) => {
        const isPublished = blog.status === "published";
        return (
          <TooltipProvider delay={150}>
            <div className="flex items-center justify-center gap-1">
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      to={`/blogs/${blog.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                        className: "size-8 text-muted-foreground hover:text-primary cursor-pointer",
                      })}
                      aria-label="عرض تفاصيل المقال"
                    />
                  }
                >
                  <Eye className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  عرض المقال
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger
                  render={
                    <Link
                      to={`/blogs/${blog.id}/edit`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "icon",
                        className: "size-8 text-muted-foreground hover:text-foreground cursor-pointer",
                      })}
                      aria-label="تحرير المقال"
                    />
                  }
                >
                  <Edit className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  تحرير المقال
                </TooltipContent>
              </Tooltip>

              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <DropdownMenuTrigger
                        className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                        aria-label="خيارات إضافية"
                      />
                    }
                  >
                    <MoreVertical className="size-4" />
                  </TooltipTrigger>
                  <TooltipContent side="top" sideOffset={6}>
                    خيارات إضافية
                  </TooltipContent>
                </Tooltip>
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
          </TooltipProvider>
        );
      },
    },
  ];

  return (
    <DataTable
      data={blogs as BlogRecord[]}
      columns={columns}
      pageSize={10}
      striped={true}
      syncWithUrl={false}
      searchPlaceholder="البحث في مقالات الجدول..."
      emptyTitle="لا توجد مقالات"
      emptyDescription="لم يتم العثور على أي مقالات تطابق معايير البحث."
    />
  );
}
