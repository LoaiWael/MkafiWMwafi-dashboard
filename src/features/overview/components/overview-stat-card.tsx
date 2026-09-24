import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OverviewStatCardProps {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export default function OverviewStatCard({
  label,
  description,
  href,
  icon: Icon,
}: OverviewStatCardProps) {
  return (
    <Link
      to={href}
      viewTransition
      className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardHeader>
          <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary">
            <Icon size={20} />
          </div>
          <CardTitle>{label}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm font-medium text-primary">فتح الصفحة</p>
        </CardContent>
      </Card>
    </Link>
  );
}
