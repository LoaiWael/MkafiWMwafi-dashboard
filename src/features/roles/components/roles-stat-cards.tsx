import { KeyRound, ShieldCheck } from "lucide-react";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { Card, CardContent } from "@/components/ui/card";
import { PERMISSION_MODULE_GROUPS, SYSTEM_PERMISSIONS } from "../constants";
import type { RoleRecord } from "../types";

interface RolesStatCardsProps {
  roles: readonly RoleRecord[];
}

export default function RolesStatCards({ roles }: RolesStatCardsProps) {
  const totalRoles = roles.length;
  const totalPermissions = SYSTEM_PERMISSIONS.length;
  const totalModules = PERMISSION_MODULE_GROUPS.length;
  const customRolesCount = roles.filter((role) => !role.isSystem).length;

  return (
    <StaggerContainer
      staggerDelay={0.06}
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4"
    >
      {/* Card 1: Number of Roles */}
      <StaggerItem>
        <Card className="group relative overflow-hidden rounded-2xl border border-primary-100/80 bg-primary-50/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-primary-900/40 dark:bg-primary-950/30">
          <CardContent className="space-y-2.5 p-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                عدد الأدوار
              </span>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700 transition-transform duration-200 group-hover:scale-105 sm:size-9 dark:bg-primary-900/60 dark:text-primary-300">
                <ShieldCheck className="size-4 sm:size-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                <bdi>{totalRoles.toLocaleString("en-US")}</bdi>
              </span>
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                أدوار وظيفية
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{roles.filter((r) => r.isSystem).length} أساسية للنظام</span>
              {customRolesCount > 0 ? (
                <>
                  <span className="size-1 rounded-full bg-border" aria-hidden />
                  <span className="text-primary font-medium">{customRolesCount} مخصصة</span>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </StaggerItem>

      {/* Card 2: Number of Permissions */}
      <StaggerItem>
        <Card className="group relative overflow-hidden rounded-2xl border border-tertiary-100/80 bg-tertiary-50/60 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-tertiary-900/40 dark:bg-tertiary-950/30">
          <CardContent className="space-y-2.5 p-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-muted-foreground sm:text-sm">
                عدد الصلاحيات
              </span>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-tertiary-100 text-tertiary-700 transition-transform duration-200 group-hover:scale-105 sm:size-9 dark:bg-tertiary-900/60 dark:text-tertiary-300">
                <KeyRound className="size-4 sm:size-5" />
              </div>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                <bdi>{totalPermissions.toLocaleString("en-US")}</bdi>
              </span>
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                صلاحية تفصيلية
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>موزعة على {totalModules} أقسام وظيفية متكاملة</span>
            </div>
          </CardContent>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
}
