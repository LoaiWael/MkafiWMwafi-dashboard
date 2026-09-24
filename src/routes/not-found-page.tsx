import { FileQuestion } from "lucide-react";
import { Link } from "react-router";
import FeaturePage from "@/components/layout/feature-page";
import { buttonVariants } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { ROUTES } from "@/lib/constants";

export default function NotFoundPage() {
  useDocumentTitle("الصفحة غير موجودة");

  return (
    <FeaturePage
      title="الصفحة غير موجودة"
      description="المسار المطلوب غير متاح في لوحة التشغيل."
      icon={FileQuestion}
      emptyTitle="تعذّر العثور على الصفحة"
      emptyDescription="يمكن العودة إلى لوحة التحكم ومتابعة العمليات من هناك."
      emptyAction={
        <Link to={ROUTES.home} viewTransition className={buttonVariants()}>
          لوحة التحكم
        </Link>
      }
    />
  );
}
