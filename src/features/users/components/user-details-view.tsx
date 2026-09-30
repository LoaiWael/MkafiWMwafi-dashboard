import { ArrowRight, Calendar, Mail, Phone, Shield } from "lucide-react";
import { Link } from "react-router";
import { FadeIn } from "@/components/animations";
import ProfileBanner from "@/features/profile/components/profile-banner";
import ProfileBreadcrumb from "@/features/profile/components/profile-breadcrumb";
import ProfileFacts from "@/features/profile/components/profile-facts";
import ProfileMissing from "@/features/profile/components/profile-missing";
import { findCustomer } from "@/features/users/constants";
import { ROUTES } from "@/lib/constants";
import type { ProfileFact } from "@/features/profile/types";

interface UserDetailsViewProps {
  userId: string | undefined;
}

export default function UserDetailsView({ userId }: UserDetailsViewProps) {
  const customer = findCustomer(userId);

  if (!customer) {
    return (
      <div className="page-shell space-y-6 py-6 sm:py-8">
        <ProfileMissing
          title="العميل غير موجود"
          description="لا يوجد حساب عميل بهذا المعرّف."
          backTo={ROUTES.users}
          backLabel="العودة إلى العملاء"
        />
      </div>
    );
  }

  const facts: ProfileFact[] = [
    {
      id: "email",
      label: "البريد الإلكتروني",
      value: customer.email,
      icon: Mail,
      ltr: true,
      copyable: true,
    },
    {
      id: "phone",
      label: "رقم الجوال",
      value: customer.phone,
      icon: Phone,
      ltr: true,
      copyable: true,
    },
    {
      id: "joined",
      label: "تاريخ الانضمام",
      value: customer.joinedAt,
      icon: Calendar,
    },
    {
      id: "role",
      label: "الصفة",
      value: customer.role,
      icon: Shield,
    },
  ];

  return (
    <div className="page-shell space-y-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProfileBreadcrumb
          items={[
            { label: "الرئيسية", to: ROUTES.home },
            { label: "العملاء", to: ROUTES.users },
            { label: customer.name },
          ]}
        />
        <Link
          to={ROUTES.users}
          viewTransition
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <ArrowRight className="size-4" />
          العودة إلى العملاء
        </Link>
      </div>

      <FadeIn>
        <ProfileBanner
          name={customer.name}
          role={customer.role}
          avatarUrl={customer.avatarUrl}
          kindLabel="حساب عميل"
          active={customer.active}
        />
      </FadeIn>

      <ProfileFacts title="بيانات العميل" facts={facts} />
    </div>
  );
}
