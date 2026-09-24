import { Wallet } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SERVICE_PRICING } from "@/features/payments/constants";

export default function PaymentsSection() {
  return (
    <FeaturePage
      title="المدفوعات"
      description="متابعة رسوم توثيق العقود السكنية والتجارية وحالة السداد."
      icon={Wallet}
      emptyTitle="لا توجد مدفوعات"
      emptyDescription="ستظهر هنا عمليات السداد بعد إتمام طلبات التوثيق."
      toolbar={
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SERVICE_PRICING.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <p className="text-2xl font-bold text-foreground">
                  <bdi>{item.amount}</bdi>
                  <span className="ms-1 text-sm font-medium text-muted-foreground">
                    ر.س {item.period}
                  </span>
                </p>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      }
    />
  );
}
