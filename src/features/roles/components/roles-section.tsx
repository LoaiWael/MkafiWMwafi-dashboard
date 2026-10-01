import { useState } from "react";
import { Plus } from "lucide-react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { useRoles } from "../hooks/use-roles";
import type { RoleRecord } from "../types";
import RoleDeleteDialog from "./role-delete-dialog";
import RoleDialog from "./role-dialog";
import RolePermissionsDialog from "./role-permissions-dialog";
import RolesStatCards from "./roles-stat-cards";
import RolesTable from "./roles-table";

export default function RolesSection() {
  const roles = useRoles();

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleRecord | null>(null);
  const [viewingRole, setViewingRole] = useState<RoleRecord | null>(null);
  const [deletingRole, setDeletingRole] = useState<RoleRecord | null>(null);

  function handleOpenCreate() {
    setEditingRole(null);
    setCreateDialogOpen(true);
  }

  function handleOpenEdit(role: RoleRecord) {
    setEditingRole(role);
    setCreateDialogOpen(true);
  }

  function handleOpenView(role: RoleRecord) {
    setViewingRole(role);
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
          <Button
            type="button"
            size="sm"
            onClick={handleOpenCreate}
            className="w-full sm:w-auto gap-2 rounded-xl text-sm font-semibold cursor-pointer"
          >
            <Plus className="size-4" />
            <span>إضافة دور جديد</span>
          </Button>
        }
      />

      {/* Stats Cards: Number of Roles and Number of Permissions */}
      <RolesStatCards roles={roles} />

      {/* Roles & Permissions Table */}
      <FadeIn duration={0.3} delay={0.1}>
        <RolesTable
          roles={roles}
          onViewPermissions={handleOpenView}
          onEditRole={handleOpenEdit}
          onDeleteRole={handleOpenDelete}
        />
      </FadeIn>

      {/* Create / Edit Dialog */}
      <RoleDialog
        open={createDialogOpen}
        role={editingRole}
        onOpenChange={setCreateDialogOpen}
      />

      {/* View Details Dialog */}
      <RolePermissionsDialog
        open={Boolean(viewingRole)}
        role={viewingRole}
        onOpenChange={(open) => {
          if (!open) setViewingRole(null);
        }}
        onEdit={handleOpenEdit}
      />

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
