import { Link, useParams } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import BlogDetailsView from "@/features/blogs/components/blog-details-view";
import { useBlog } from "@/features/blogs/hooks/use-blogs";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function BlogDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const blog = useBlog(id);

  const title = blog ? `${blog.title} | المدونة` : "المقال غير موجود";

  useDocumentTitle(title);

  if (!blog) {
    return (
      <div className="page-shell py-12">
        <div className="mx-auto max-w-lg rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary mb-4">
            <BookOpen className="size-7" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            لم يتم العثور على المقال
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            المقال المطلوب غير متوفر أو تم حذفه مسبقاً من النظام.
          </p>
          <div className="mt-6">
            <Link
              to="/blogs"
              className={buttonVariants({
                variant: "primary",
                className: "gap-2",
              })}
            >
              <ArrowRight className="size-4" />
              <span>العودة لقائمة المقالات</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <BlogDetailsView blog={blog} />;
}
