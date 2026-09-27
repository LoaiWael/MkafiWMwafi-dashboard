import PageHeader from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil } from "lucide-react";

export default function ContentSection() {
  return (
    <div className="page-shell space-y-6 py-8">
      <PageHeader
        title="محتوى الموقع"
        description="تخصيص وإدارة بيانات ومحتوى الصفحة الرئيسية وصفحة من نحن."
      />

      <Card className="border-dashed border-border bg-card/50">
        <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Pencil className="size-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">
            تخصيص محتوى الموقع
          </h3>
          <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
            سيتم هنا إضافة خيارات التحكم وتعديل بيانات الصفحة الرئيسية وصفحة من نحن.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
