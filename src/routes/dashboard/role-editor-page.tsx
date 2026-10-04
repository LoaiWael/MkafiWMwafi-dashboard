import { useParams } from "react-router";
import RoleEditorView from "@/features/roles/components/role-editor-view";
import { useRole } from "@/features/roles/hooks/use-roles";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function RoleEditorPage() {
  const { id } = useParams<{ id?: string }>();
  const isEditing = Boolean(id);
  const role = useRole(id);

  useDocumentTitle(
    isEditing
      ? role?.name ?? "تفاصيل الدور والصلاحيات"
      : "إضافة دور وظيفي جديد",
  );

  return <RoleEditorView roleId={id} />;
}
