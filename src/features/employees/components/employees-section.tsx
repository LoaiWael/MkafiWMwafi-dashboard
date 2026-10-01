import { useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { setEmployeeActive } from "@/features/employees/employees-store";
import { useEmployees } from "@/features/employees/hooks/use-employees";
import {
  EMPLOYEE_ROLE_PARAM,
  EMPLOYEE_STATUS,
  EMPLOYEE_STATUS_PARAM,
  type EmployeeRecord,
} from "../constants";
import EmployeeDialog from "./employee-dialog";
import EmployeesStatCards from "./employees-stat-cards";
import EmployeesTable from "./employees-table";

const EMPLOYEE_ROLE_TABS = [
  { value: EMPLOYEE_STATUS.all, label: "جميع الأدوار" },
  { value: "مدير النظام", label: "مدراء النظام" },
  { value: "مدير العمليات", label: "مدراء العمليات" },
  { value: "مسؤول توثيق", label: "مسؤولو التوثيق" },
  { value: "مدقق عقود", label: "مدققو العقود" },
  { value: "دعم فني", label: "الدعم الفني" },
] as const;

export default function EmployeesSection() {
  const employees = useEmployees();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(
    null,
  );

  const activeStatus =
    searchParams.get(EMPLOYEE_STATUS_PARAM) || EMPLOYEE_STATUS.all;
  const activeRole = searchParams.get(EMPLOYEE_ROLE_PARAM) || EMPLOYEE_STATUS.all;

  function handleToggleStatus(employee: EmployeeRecord) {
    setEmployeeActive(employee.id, !employee.active);
  }

  function handleOpenCreate() {
    setEditingEmployee(null);
    setDialogOpen(true);
  }

  function handleOpenEdit(employee: EmployeeRecord) {
    setEditingEmployee(employee);
    setDialogOpen(true);
  }

  function handleRoleChange(value: string | null) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (!value || value === EMPLOYEE_STATUS.all) {
          next.delete(EMPLOYEE_ROLE_PARAM);
        } else {
          next.set(EMPLOYEE_ROLE_PARAM, value);
        }
        return next;
      },
      { replace: true },
    );
  }

  function handleFilterChange(filterKey: "status" | "role", value: string) {
    const param =
      filterKey === "status" ? EMPLOYEE_STATUS_PARAM : EMPLOYEE_ROLE_PARAM;

    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value === EMPLOYEE_STATUS.all) next.delete(param);
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
        next.delete(EMPLOYEE_STATUS_PARAM);
        next.delete(EMPLOYEE_ROLE_PARAM);
        return next;
      },
      { replace: true },
    );
  }

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <PageHeader
        title="الموظفين"
        description="إدارة حسابات الموظفين والأدوار وبيانات التواصل والصلاحيات داخل لوحة التحكم."
        actions={
          <Button
            type="button"
            size="sm"
            onClick={handleOpenCreate}
            className="gap-2 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Plus className="size-4" />
            <span>إضافة موظف</span>
          </Button>
        }
      />

      <EmployeesStatCards
        employees={employees}
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
              <TabsList className="w-auto flex flex-nowrap" aria-label="الدور الوظيفي">
                {EMPLOYEE_ROLE_TABS.map((tab) => {
                  const count =
                    tab.value === EMPLOYEE_STATUS.all
                      ? employees.length
                      : employees.filter((e) => e.role === tab.value).length;
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
              onClick={() => handleFilterChange("status", EMPLOYEE_STATUS.all)}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === EMPLOYEE_STATUS.all
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              )}
            >
              الكل
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("status", EMPLOYEE_STATUS.active)}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === EMPLOYEE_STATUS.active
                  ? "bg-emerald-600 text-white font-semibold"
                  : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20",
              )}
            >
              نشط
            </button>
            <button
              type="button"
              onClick={() => handleFilterChange("status", EMPLOYEE_STATUS.inactive)}
              className={cn(
                "rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 active:scale-98",
                activeStatus === EMPLOYEE_STATUS.inactive
                  ? "bg-amber-600 text-white font-semibold"
                  : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20",
              )}
            >
              موقوف
            </button>
          </div>
        </div>
      </FadeIn>

      <FadeIn duration={0.3} delay={0.15}>
        <EmployeesTable
          employees={employees}
          onToggleStatus={handleToggleStatus}
          onEdit={handleOpenEdit}
        />
      </FadeIn>

      <EmployeeDialog
        open={dialogOpen}
        employee={editingEmployee}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}

