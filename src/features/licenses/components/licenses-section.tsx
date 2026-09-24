import { BadgeCheck } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AUTHORITIES } from "@/features/licenses/constants";

export default function LicensesSection() {
  return (
    <div className="page-shell py-8">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          التراخيص
        </h2>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          متابعة شهادات وتراخيص المنصة الصادرة عن الجهات الرسمية.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {AUTHORITIES.map((authority) => (
          <Card key={authority.id} className="h-full">
            <CardHeader>
              <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
                <BadgeCheck size={20} />
              </div>
              <CardTitle>{authority.name}</CardTitle>
              <CardDescription>{authority.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
