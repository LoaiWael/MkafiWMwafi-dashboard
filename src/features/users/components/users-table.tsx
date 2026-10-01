import { Ban, Eye, LockOpen, MoreVertical, SaudiRiyal, Users } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/ui/copy-button";
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
  USER_ROLE_PARAM,
  USER_STATUS,
  USER_STATUS_PARAM,
  type CustomerRecord,
} from "../constants";

interface UsersTableProps {
  customers: readonly CustomerRecord[];
  onToggleBlock?: (customer: CustomerRecord) => void;
}

export default function UsersTable({
  customers,
  onToggleBlock,
}: UsersTableProps) {
  const roles = [...new Set(customers.map((customer) => customer.role))];

  const columns: DataTableColumn<CustomerRecord>[] = [
    {
      id: "name",
      header: "العميل",
      accessorKey: "name",
      minWidth: "220px",
      cell: (item) => (
        <span className="flex items-center gap-2.5">
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
            <Link
              to={`${ROUTES.users}/${item.id}`}
              viewTransition
              className="block truncate text-sm font-bold text-foreground hover:text-primary"
            >
              {item.name}
            </Link>
            <span
              dir="ltr"
              className="block truncate text-end font-mono text-xs text-muted-foreground"
            >
              {item.id}
            </span>
          </span>
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
          <bdi dir="ltr" className="truncate text-sm text-foreground">
            {item.email}
          </bdi>
          <CopyButton
            value={item.email}
            itemId={`customer-email-${item.id}`}
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
            itemId={`customer-phone-${item.id}`}
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
      id: "residentialContracts",
      header: "عقود سكنية",
      accessorKey: "residentialContracts",
      sortable: true,
      minWidth: "120px",
      cell: (item) => (
        <span
          dir="ltr"
          className="block text-end text-sm font-semibold text-foreground"
        >
          {item.residentialContracts.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      id: "commercialContracts",
      header: "عقود تجارية",
      accessorKey: "commercialContracts",
      sortable: true,
      minWidth: "120px",
      cell: (item) => (
        <span
          dir="ltr"
          className="block text-end text-sm font-semibold text-foreground"
        >
          {item.commercialContracts.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      id: "properties",
      header: "العقارات",
      accessorKey: "properties",
      sortable: true,
      minWidth: "110px",
      cell: (item) => (
        <span
          dir="ltr"
          className="block text-end text-sm font-semibold text-foreground"
        >
          {item.properties.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      id: "units",
      header: "الوحدات",
      accessorKey: "units",
      sortable: true,
      minWidth: "100px",
      cell: (item) => (
        <span
          dir="ltr"
          className="block text-end text-sm font-semibold text-foreground"
        >
          {item.units.toLocaleString("en-US")}
        </span>
      ),
    },
    {
      id: "amountSpent",
      header: "إجمالي المصروف",
      accessorKey: "amountSpent",
      sortable: true,
      minWidth: "150px",
      cell: (item) => (
        <span
          dir="ltr"
          className="flex items-center justify-end gap-1 text-sm font-semibold text-foreground"
        >
          <span>{item.amountSpent.toLocaleString("en-US")}</span>
          <SaudiRiyal className="size-3.5 shrink-0 text-muted-foreground" />
        </span>
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
              ? "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-destructive/20 bg-destructive/10 text-destructive"
          }
        >
          {item.active ? "غير محظور" : "محظور"}
        </Badge>
      ),
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
                      to={`${ROUTES.users}/${item.id}`}
                      viewTransition
                      className="flex items-center gap-2 cursor-pointer"
                    />
                  }
                  className="gap-2 cursor-pointer font-medium transition-colors hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:text-primary"
                >
                  <Eye className="size-4 text-primary shrink-0" />
                  <span>عرض ملف العميل</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onToggleBlock?.(item)}
                  className={cn(
                    "gap-2 cursor-pointer font-medium transition-colors",
                    item.active
                      ? "text-destructive hover:bg-destructive/10 hover:text-destructive focus:bg-destructive/10 focus:text-destructive"
                      : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 focus:bg-emerald-500/10 focus:text-emerald-600 dark:focus:text-emerald-400",
                  )}
                >
                  {item.active ? (
                    <>
                      <Ban className="size-4 shrink-0" />
                      <span>حظر الحساب</span>
                    </>
                  ) : (
                    <>
                      <LockOpen className="size-4 shrink-0" />
                      <span>إلغاء الحظر</span>
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

  const filters: DataTableFilterConfig<CustomerRecord>[] = [
    {
      id: USER_STATUS_PARAM,
      title: "الحالة",
      options: [
        { value: USER_STATUS.unblocked, label: "غير محظور" },
        { value: USER_STATUS.blocked, label: "محظور" },
      ],
      filterFn: (item, value) => {
        if (value === USER_STATUS.unblocked) return item.active;
        if (value === USER_STATUS.blocked) return !item.active;
        return true;
      },
    },
    {
      id: USER_ROLE_PARAM,
      title: "الصفة",
      accessorKey: "role",
      options: roles.map((role) => ({ value: role, label: role })),
    },
  ];

  return (
    <DataTable
      data={[...customers]}
      columns={columns}
      title="سجل العملاء"
      subtitle="بيانات التواصل، والعقود السكنية والتجارية، والعقارات والوحدات، وإجمالي المصروف بالريال."
      searchPlaceholder="بحث بالاسم أو الصفة أو البريد أو الجوال..."
      searchFilter={(item, query) => {
        const haystack = [item.name, item.role, item.email, item.phone, item.id]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      }}
      filters={filters}
      emptyTitle="لا يوجد عملاء"
      emptyDescription="لا توجد نتائج تطابق البحث أو عوامل التصفية الحالية."
      emptyIcon={Users}
      pageSize={10}
    />
  );
}
