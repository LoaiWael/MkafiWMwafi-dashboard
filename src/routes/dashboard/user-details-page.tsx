import { Link, useParams } from "react-router";
import { ArrowRight, User } from "lucide-react";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();

  useDocumentTitle(`تفاصيل المستخدم #${id || ""}`);

  return (
    <div className="page-shell space-y-6 py-6 sm:py-8" dir="rtl">
      {/* Breadcrumbs & Navigation */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link to="/" viewTransition className="hover:text-foreground">
            الرئيسية
          </Link>
          <span>/</span>
          <Link to="/users" viewTransition className="hover:text-foreground">
            المستخدمين
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">تفاصيل المستخدم ({id})</span>
        </div>

        <Link
          to="/users"
          viewTransition
          className="inline-flex h-8.5 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
        >
          <ArrowRight className="size-3.5" />
          <span>العودة لقائمة المستخدمين</span>
        </Link>
      </div>

      {/* Blank Placeholder Shell for User Details */}
      <div className="min-h-[400px] flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 p-8 text-center">
        <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
          <User className="size-7" />
        </div>
        <h2 className="text-lg font-bold text-foreground mb-1">
          صفحة تفاصيل المستخدم
        </h2>
        <p className="text-xs text-muted-foreground font-mono">
          معرّف المستخدم: {id}
        </p>
      </div>
    </div>
  );
}
