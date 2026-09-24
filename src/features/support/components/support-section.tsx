import { Headset } from "lucide-react";
import FeaturePage from "@/components/layout/feature-page";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SUPPORT_CHANNELS } from "@/features/support/constants";

export default function SupportSection() {
  return (
    <FeaturePage
      title="الدعم"
      description="متابعة استفسارات التواصل الواردة من الموقع حول توثيق العقود."
      icon={Headset}
      emptyTitle="لا توجد استفسارات"
      emptyDescription="ستظهر هنا رسائل العملاء بعد وصول طلبات المساعدة من الموقع."
      toolbar={
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {SUPPORT_CHANNELS.map((channel) => (
            <Card key={channel.id}>
              <CardHeader>
                <CardTitle>{channel.label}</CardTitle>
                <CardDescription>
                  {channel.href ? (
                    <a
                      href={channel.href}
                      className="text-foreground underline-offset-4 hover:underline"
                      dir="ltr"
                    >
                      {channel.value}
                    </a>
                  ) : (
                    channel.value
                  )}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      }
    />
  );
}
