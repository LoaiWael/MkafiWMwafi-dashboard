import {
  Eye,
  MoreVertical,
  Pencil,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { profileInitials } from "@/features/profile/components/profile-banner";
import { PERMISSION_MODULE_GROUPS, SYSTEM_PERMISSIONS } from "../constants";
import { getRoleEmployees } from "../roles-store";
import type { RoleRecord } from "../types";

interface RolesTableProps {
  roles: readonly RoleRecord[];
  onViewPermissions: (role: RoleRecord) => void;
  onEditRole: (role: RoleRecord) => void;
  onDeleteRole: (role: RoleRecord) => void;
}

export default function RolesTable({
  roles,
  onViewPermissions,
  onEditRole,
  onDeleteRole,
}: RolesTableProps) {
  const columns: DataTableColumn<RoleRecord>[] = [
    {
      id: "name",
      header: "الدور الوظيفي",
      accessorKey: "name",
      minWidth: "220px",
      cell: (item) => (
        <div className="flex items-start gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
            <ShieldCheck className="size-4" />
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-foreground">
                {item.name}
              </span>
              {item.isSystem ? (
                <Badge
                  variant="outline"
                  className="border-primary/20 bg-primary/10 text-primary text-[10px] font-semibold"
                >
                  أساسي
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px]">
                  مخصص
                </Badge>
              )}
            </div>
            {item.description ? (
              <p className="text-xs text-muted-foreground line-clamp-1 max-w-sm">
                {item.description}
              </p>
            ) : null}
          </div>
        </div>
      ),
    },
    {
      id: "employeesCount",
      header: "الموظفون المرتبطون",
      minWidth: "160px",
      cell: (item) => {
        const employees = getRoleEmployees(item.name);
        const count = employees.length;

        if (count === 0) {
          return (
            <span className="text-xs text-muted-foreground">
              لا يوجد موظفون
            </span>
          );
        }

        const visibleEmps = employees.slice(0, 3);
        const remaining = count - visibleEmps.length;

        return (
          <TooltipProvider delay={100}>
            <Tooltip>
              <TooltipTrigger
                type="button"
                onClick={() => onViewPermissions(item)}
                className="flex items-center gap-2 cursor-pointer text-start"
              >
                <AvatarGroup className="-space-x-1.5 space-x-reverse">
                  {visibleEmps.map((emp) => (
                    <Avatar
                      key={emp.id}
                      className="size-7 border-2 border-background ring-1 ring-border hover:z-10 transition-transform hover:scale-110"
                    >
                      {emp.avatarUrl ? (
                        <AvatarImage src={emp.avatarUrl} alt="" />
                      ) : null}
                      <AvatarFallback className="bg-primary/15 text-[10px] font-bold text-primary">
                        {profileInitials(emp.name)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {remaining > 0 ? (
                    <div className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-bold text-muted-foreground ring-1 ring-border z-0">
                      +{remaining}
                    </div>
                  ) : null}
                </AvatarGroup>
                <span className="text-xs font-semibold text-foreground">
                  <bdi>{count}</bdi> موظف
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" sideOffset={6} className="text-xs max-w-xs">
                <p className="font-semibold mb-1">الموظفون المسند إليهم:</p>
                <p className="text-muted-foreground">
                  {employees.map((e) => e.name).join("، ")}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      id: "permissions",
      header: "الصلاحيات الممنوحة",
      minWidth: "240px",
      cell: (item) => {
        const total = item.permissionKeys.length;
        const totalSys = SYSTEM_PERMISSIONS.length;
        const isFull = total === totalSys;

        // Group counts
        const activeModules = PERMISSION_MODULE_GROUPS.filter((group) =>
          group.permissions.some((p) => item.permissionKeys.includes(p.key)),
        );

        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-foreground">
                <bdi>{total}</bdi> من <bdi>{totalSys}</bdi> صلاحية
              </span>
              {isFull ? (
                <Badge
                  variant="outline"
                  className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold"
                >
                  صلاحيات كاملة
                </Badge>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-1">
              {activeModules.slice(0, 3).map((group) => (
                <Badge
                  key={group.id}
                  variant="secondary"
                  className="text-[10px] font-medium"
                >
                  {group.label}
                </Badge>
              ))}
              {activeModules.length > 3 ? (
                <Badge variant="outline" className="text-[10px] font-mono">
                  +{activeModules.length - 3} أقسام
                </Badge>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      id: "createdAt",
      header: "تاريخ الإنشاء",
      accessorKey: "createdAt",
      minWidth: "130px",
      cell: (item) => (
        <span className="text-xs text-muted-foreground font-medium">
          {item.createdAt}
        </span>
      ),
    },
    {
      id: "actions",
      header: "الإجراءات",
      align: "center",
      minWidth: "80px",
      cell: (item) => {
        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted hover:text-primary cursor-pointer"
                aria-label={`خيارات دور ${item.name}`}
              >
                <MoreVertical className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-1 text-xs">
                <DropdownMenuGroup className="space-y-0.5">
                  <DropdownMenuItem
                    onClick={() => onViewPermissions(item)}
                    className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                  >
                    <Eye className="size-4 text-primary shrink-0" />
                    <span>عرض تفاصيل الصلاحيات</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => onEditRole(item)}
                    className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                  >
                    <Pencil className="size-4 text-primary shrink-0" />
                    <span>تعديل الدور والصلاحيات</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    disabled={item.isSystem}
                    onClick={() => onDeleteRole(item)}
                    className="gap-2 cursor-pointer font-medium text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="size-4 text-destructive shrink-0" />
                    <span>{item.isSystem ? "دور أساسي (لا يحذف)" : "حذف الدور"}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const filters: DataTableFilterConfig<RoleRecord>[] = [
    {
      id: "roleType",
      title: "نوع الدور",
      options: [
        { value: "system", label: "أساسي للنظام" },
        { value: "custom", label: "مخصص" },
      ],
      filterFn: (item, value) => {
        if (value === "system") return Boolean(item.isSystem);
        if (value === "custom") return !item.isSystem;
        return true;
      },
    },
  ];

  return (
    <DataTable
      data={[...roles]}
      columns={columns}
      title="مصفوفة الأدوار والصلاحيات"
      subtitle="استعراض وتعديل كافة الأدوار الوظيفية المعتمدة ومستوى الوصول الممنوح لكل دور في لوحة التحكم."
      searchPlaceholder="البحث باسم الدور أو الصلاحية أو الوصف..."
      searchFilter={(item, query) => {
        const haystack = [
          item.name,
          item.description,
          item.id,
          ...item.permissionKeys,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      }}
      filters={filters}
      emptyTitle="لا توجد أدوار مسجلة"
      emptyDescription="لا توجد نتائج تطابق معايير البحث الحالية."
      emptyIcon={ShieldAlert}
      pageSize={10}
    />
  );
}
