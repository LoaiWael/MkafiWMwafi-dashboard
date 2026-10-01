import { useState } from "react";
import { Download } from "lucide-react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import WarningDialog from "@/components/warning-dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { setCustomerBlocked } from "@/features/users/customers-store";
import { useCustomers } from "@/features/users/hooks/use-customers";
import {
  USER_ROLE,
  USER_ROLE_PARAM,
  USER_STATUS,
  USER_STATUS_PARAM,
  type CustomerRecord,
} from "../constants";
import UsersStatCards from "./users-stat-cards";
import UsersTable from "./users-table";

const USER_ROLE_TABS = [
  { value: USER_STATUS.all, label: "جميع المستخدمين" },
  { value: USER_ROLE, label: "المستخدمون" },
] as const;

export default function UsersSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pendingCustomer, setPendingCustomer] = useState<CustomerRecord | null>(
    null,
  );
  const customers = useCustomers();

  const activeStatus =
    searchParams.get(USER_STATUS_PARAM) || USER_STATUS.all;
  const activeRole = searchParams.get(USER_ROLE_PARAM) || USER_STATUS.all;

  function handleConfirmBlock() {
    if (!pendingCustomer) return;
    const willBlock = pendingCustomer.active;
    setCustomerBlocked(pendingCustomer.id, willBlock);
    toast.success(willBlock ? "تم حظر الحساب" : "تم إلغاء الحظر");
  }

  function handleRoleChange(value: string | null) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!value || value === USER_STATUS.all) {
          next.delete(USER_ROLE_PARAM);
        } else {
          next.set(USER_ROLE_PARAM, value);
        }
        return next;
      },
      { replace: true },
    );
  }

  function handleFilterChange(filterKey: "status" | "role", value: string) {
    const param = filterKey === "status" ? USER_STATUS_PARAM : USER_ROLE_PARAM;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value === USER_STATUS.all) next.delete(param);
        else next.set(param, value);
        return next;
      },
      { replace: true },
    );
  }

  function handleClearFilters() {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        next.delete(USER_STATUS_PARAM);
        next.delete(USER_ROLE_PARAM);
        return next;
      },
      { replace: true },
    );
  }

  function handleRefresh() {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("تم تحديث ومزامنة بيانات العملاء بنجاح");
    }, 600);
  }

  function handleExport() {
    const csvContent = [
      [
        "المعرف",
        "اسم العميل",
        "الصفة",
        "البريد الإلكتروني",
        "رقم الجوال",
        "الحالة",
        "تاريخ الانضمام",
      ].join(","),
      ...customers.map((c) =>
        [
          c.id,
          c.name,
          c.role,
          c.email,
          c.phone,
          c.active ? "غير محظور" : "محظور",
          c.joinedAt,
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `customers-export-${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("تم تصدير سجل العملاء كملف CSV بنجاح");
  }

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <PageHeader
        title="العملاء"
        description="إدارة حسابات المستخدمين في عقود الإيجار."
        showRefresh
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        refreshTooltip="تحديث ومزامنة بيانات العملاء"
        actions={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Download className="size-4" />
            <span>تصدير CSV</span>
          </Button>
        }
      />

      <UsersStatCards
        customers={customers}
        activeStatusFilter={activeStatus}
        activeRoleFilter={activeRole}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Main Filter Toolbar */}
      <FadeIn duration={0.3} delay={0.1}>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-xs lg:flex-row lg:items-center">
          {/* Role Tabs */}
          <div className="overflow-x-auto no-scrollbar max-w-full">
            <Tabs value={activeRole} onValueChange={handleRoleChange}>
              <TabsList className="w-auto flex flex-nowrap" aria-label="صفة العميل">
                {USER_ROLE_TABS.map((tab) => {
                  const count =
                    tab.value === USER_STATUS.all
                      ? customers.length
                      : customers.filter((c) => c.role === tab.value).length;
                  return (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="text-xs sm:text-sm font-medium cursor-pointer whitespace-nowrap shrink-0 px-2.5 sm:px-3"
                    >
                      <span>{tab.label}</span>
                      <span className="ms-1.5 rounded-full bg-muted px-1.5 py-0.5 text-[10px] sm:text-xs font-bold">
                        {count}
                      </span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
          </div>

          {/* Quick Status Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full whitespace-nowrap pt-1 lg:pt-0">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground me-1 shrink-0">
              حالة الحساب:
            </span>
            <button
              type="button"
              onClick={() => handleFilterChange("status", USER_STATUS.all)}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === USER_STATUS.all
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("status", USER_STATUS.unblocked)}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === USER_STATUS.unblocked
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
              )}
            >
              غير محظور
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("status", USER_STATUS.blocked)}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === USER_STATUS.blocked
                  ? "bg-destructive text-white font-semibold"
                  : "bg-destructive/10 text-destructive hover:bg-destructive/20",
              )}
            >
              محظور
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn duration={0.3} delay={0.15}>
        <UsersTable customers={customers} onToggleBlock={setPendingCustomer} />
      </FadeIn>

      <WarningDialog
        open={Boolean(pendingCustomer)}
        onOpenChange={(open) => {
          if (!open) setPendingCustomer(null);
        }}
        title={pendingCustomer?.active ? "حظر الحساب" : "إلغاء الحظر"}
        description={
          pendingCustomer?.active
            ? `حظر حساب ${pendingCustomer.name} يمنع استخدام المنصة إلى حين إلغاء الحظر.`
            : `إلغاء الحظر عن حساب ${pendingCustomer?.name ?? ""} يعيد إمكانية استخدام المنصة.`
        }
        confirmLabel={pendingCustomer?.active ? "حظر الحساب" : "إلغاء الحظر"}
        onConfirm={handleConfirmBlock}
      />
    </div>
  );
}

