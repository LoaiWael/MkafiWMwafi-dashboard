import { useState } from "react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { ROUTES } from "@/lib/constants";
import { useRoles } from "../hooks/use-roles";
import type { RoleRecord } from "../types";
import RoleDeleteDialog from "./role-delete-dialog";
import RolesTable from "./roles-table";

export default function RolesSection() {
  const roles = useRoles();
  const navigate = useNavigate();

  const [deletingRole, setDeletingRole] = useState<RoleRecord | null>(null);

  function handleOpenEdit(role: RoleRecord) {
    navigate(`${ROUTES.roleDetails(role.id)}?edit=true`, { viewTransition: true });
  }

  function handleOpenView(role: RoleRecord) {
    navigate(ROUTES.roleDetails(role.id), { viewTransition: true });
  }

  function handleOpenDelete(role: RoleRecord) {
    setDeletingRole(role);
  }

  return (
    <div className="page-shell space-y-3 py-3 md:space-y-6 md:py-8">
      <PageHeader
        title="الأدوار والصلاحيات"
        description="إدارة وتخصيص أدوار المستخدمين وتحديد مصفوفة الصلاحيات الممنوحة للموظفين في لوحة التحكم."
        actions={
          <Link
            to={ROUTES.roleCreate}
            viewTransition
            className="inline-flex h-9 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 cursor-pointer"
          >
            <Plus className="size-4" />
            <span>إضافة دور جديد</span>
          </Link>
        }
      />

      {/* Roles & Permissions Table */}
      <FadeIn duration={0.3} delay={0.1}>
        <RolesTable
          roles={roles}
          onViewPermissions={handleOpenView}
          onEditRole={handleOpenEdit}
          onDeleteRole={handleOpenDelete}
        />
      </FadeIn>

      {/* Delete Confirmation Alert */}
      <RoleDeleteDialog
        open={Boolean(deletingRole)}
        role={deletingRole}
        onOpenChange={(open) => {
          if (!open) setDeletingRole(null);
        }}
      />
    </div>
  );
}


