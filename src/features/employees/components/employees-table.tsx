import { useState } from "react";
import {
  Eye,
  MoreVertical,
  Pencil,
  ShieldCheck,
  UserCheck,
  UserX,
  Users,
} from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
import WarningDialog from "@/components/warning-dialog";
import {
  DataTable,
  type DataTableColumn,
  type DataTableFilterConfig,
} from "@/components/ui/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { profileInitials } from "@/features/profile/components/profile-banner";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  EMPLOYEE_ROLE_PARAM,
  EMPLOYEE_STATUS,
  EMPLOYEE_STATUS_PARAM,
  type EmployeeRecord,
} from "../constants";

interface EmployeesTableProps {
  employees: readonly EmployeeRecord[];
  onToggleStatus?: (employee: EmployeeRecord) => void;
  onEdit?: (employee: EmployeeRecord) => void;
}

export default function EmployeesTable({
  employees,
  onToggleStatus,
  onEdit,
}: EmployeesTableProps) {
  const [deactivateEmployee, setDeactivateEmployee] = useState<EmployeeRecord | null>(null);

  const confirmDeactivate = () => {
    if (deactivateEmployee) {
      onToggleStatus?.(deactivateEmployee);
      setDeactivateEmployee(null);
    }
  };

  const roles = [...new Set(employees.map((employee) => employee.role))];

  const columns: DataTableColumn<EmployeeRecord>[] = [
    {
      id: "name",
      header: "الموظف",
      accessorKey: "name",
      minWidth: "220px",
      cell: (item) => (
        <Link
          to={`${ROUTES.employees}/${item.id}`}
          viewTransition
          className="flex items-center gap-2.5"
        >
          <span className="relative shrink-0">
            <Avatar className="size-10 border border-border">
              {item.avatarUrl ? (
                <AvatarImage src={item.avatarUrl} alt="" />
              ) : null}
              <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                {profileInitials(item.name)}
              </AvatarFallback>
            </Avatar>
            {item.active ? (
              <span
                className="absolute bottom-0 end-0 size-2.5 rounded-full border-2 border-card bg-emerald-500"
                aria-hidden
              />
            ) : null}
          </span>
          <span className="min-w-0 text-start">
            <span className="block truncate text-sm font-bold text-foreground">
              {item.name}
            </span>
            <span
              dir="ltr"
              className="block truncate text-end font-mono text-xs text-muted-foreground"
            >
              {item.id}
            </span>
          </span>
        </Link>
      ),
    },
    {
      id: "role",
      header: "الدور",
      accessorKey: "role",
      minWidth: "160px",
      cell: (item) => (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary dark:border-primary-800 dark:bg-primary-950/50 dark:text-primary-300">
          <ShieldCheck className="size-3.5 shrink-0" />
          <span>{item.role}</span>
        </span>
      ),
    },
    {
      id: "email",
      header: "البريد الإلكتروني",
      accessorKey: "email",
      minWidth: "220px",
      cell: (item) => (
        <span className="flex items-center gap-1">
          <bdi
            dir="ltr"
            className="truncate text-sm text-foreground"
          >
            {item.email}
          </bdi>
          <CopyButton
            value={item.email}
            itemId={`employee-email-${item.id}`}
            label="نسخ البريد الإلكتروني"
          />
        </span>
      ),
    },
    {
      id: "phone",
      header: "رقم الجوال",
      accessorKey: "phone",
      minWidth: "150px",
      cell: (item) => (
        <span className="flex items-center gap-1">
          <bdi dir="ltr" className="font-mono text-sm text-foreground">
            {item.phone}
          </bdi>
          <CopyButton
            value={item.phone}
            itemId={`employee-phone-${item.id}`}
            label="نسخ رقم الجوال"
          />
        </span>
      ),
    },
    {
      id: "joinedAt",
      header: "تاريخ الانضمام",
      minWidth: "140px",
      cell: (item) => (
        <span className="text-sm text-foreground">{item.joinedAt}</span>
      ),
    },
    {
      id: "status",
      header: "الحالة",
      minWidth: "110px",
      cell: (item) => (
        <Badge
          variant="outline"
          className={
            item.active
              ? "border-primary/20 bg-primary/10 text-primary"
              : "text-muted-foreground"
          }
        >
          {item.active ? "نشط" : "موقوف"}
        </Badge>
      ),
    },
    {
      id: "permissions",
      header: "الصلاحيات",
      minWidth: "180px",
      cell: (item) => {
        const visible = item.permissions.slice(0, 2);
        const hidden = item.permissions.length - visible.length;

        return (
          <span className="flex flex-wrap items-center gap-1">
            {visible.map((permission) => (
              <Badge key={permission.id} variant="secondary">
                {permission.label}
              </Badge>
            ))}
            {hidden > 0 ? (
              <Badge variant="outline">
                <bdi>+{hidden}</bdi>
              </Badge>
            ) : null}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "80px",
      cell: (item) => (
        <div className="flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
              aria-label={`خيارات ${item.name}`}
            >
              <MoreVertical className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 p-1 text-xs">
              <DropdownMenuGroup className="space-y-0.5">
                <DropdownMenuItem
                  render={
                    <Link
                      to={`${ROUTES.employees}/${item.id}`}
                      viewTransition
                      className="flex items-center gap-2 cursor-pointer"
                    />
                  }
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Eye className="size-4 text-primary shrink-0" />
                  <span>عرض ملف الموظف</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onEdit?.(item)}
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Pencil className="size-4 text-primary shrink-0" />
                  <span>تعديل بيانات الموظف</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    if (item.active) {
                      setDeactivateEmployee(item);
                    } else {
                      onToggleStatus?.(item);
                    }
                  }}
                  className={cn(
                    "gap-2 cursor-pointer font-medium transition-colors",
                    item.active
                      ? "text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                      : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400",
                  )}
                >
                  {item.active ? (
                    <>
                      <UserX className="size-4 text-destructive shrink-0" />
                      <span>إيقاف الحساب</span>
                    </>
                  ) : (
                    <>
                      <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>تفعيل الحساب</span>
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  const filters: DataTableFilterConfig<EmployeeRecord>[] = [
    {
      id: EMPLOYEE_STATUS_PARAM,
      title: "الحالة",
      options: [
        { value: EMPLOYEE_STATUS.active, label: "نشط" },
        { value: EMPLOYEE_STATUS.inactive, label: "موقوف" },
      ],
      filterFn: (item, value) => {
        if (value === EMPLOYEE_STATUS.active) return item.active;
        if (value === EMPLOYEE_STATUS.inactive) return !item.active;
        return true;
      },
    },
    {
      id: EMPLOYEE_ROLE_PARAM,
      title: "الدور",
      accessorKey: "role",
      options: roles.map((role) => ({ value: role, label: role })),
    },
  ];

  return (
    <>
      <DataTable
        data={[...employees]}
        columns={columns}
        title="سجل الموظفين"
        subtitle="الصورة والدور وبيانات التواصل وتاريخ الانضمام والصلاحيات، بنفس حقول الملف الشخصي."
        searchPlaceholder="بحث بالاسم أو الدور أو البريد أو الجوال..."
        searchFilter={(item, query) => {
          const haystack = [
            item.name,
            item.role,
            item.email,
            item.phone,
            item.id,
            ...item.permissions.map((permission) => permission.label),
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(query);
        }}
        filters={filters}
        emptyTitle="لا يوجد موظفون"
        emptyDescription="لا توجد نتائج تطابق البحث أو عوامل التصفية الحالية."
        emptyIcon={Users}
        pageSize={10}
      />
      <WarningDialog
        open={!!deactivateEmployee}
        onOpenChange={(open) => {
          if (!open) setDeactivateEmployee(null);
        }}
        title="إيقاف الحساب"
        description={`إيقاف حساب ${deactivateEmployee?.name} يمنع الدخول إلى لوحة التحكم إلى حين إعادة التفعيل.`}
        confirmLabel="إيقاف الحساب"
        onConfirm={confirmDeactivate}
      />
    </>
  );
}
