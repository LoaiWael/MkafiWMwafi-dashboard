import { useState } from "react";
import { LogOut, Pencil } from "lucide-react";
import { FadeIn } from "@/components/animations";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import EditProfileDialog from "@/features/profile/components/edit-profile-dialog";
import LogoutDialog from "@/features/profile/components/logout-dialog";
import ProfileActivityLog from "@/features/profile/components/profile-activity-log";
import ProfileBanner from "@/features/profile/components/profile-banner";
import ProfileFacts from "@/features/profile/components/profile-facts";
import ProfilePermissions from "@/features/profile/components/profile-permissions";
import { ADMIN_PERMISSIONS } from "@/features/profile/constants";
import { useAdminProfile } from "@/features/profile/hooks/use-admin-profile";
import { useDocumentTitle } from "@/hooks/use-document-title";
import ProfilePageSkeleton from "./profile-page-skeleton";

export default function ProfilePage() {
  const { profile, activity, isLoading } = useAdminProfile();
  const [editOpen, setEditOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  useDocumentTitle(profile.name || "الملف الشخصي");

  if (isLoading && !profile.id && !profile.email && !profile.name) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="page-shell space-y-4 py-4 sm:space-y-6 sm:py-8">
      <PageHeader
        title="الملف الشخصي"
        description="بيانات الحساب الحالي والصلاحيات وسجل النشاط."
        actions={
          <Button
            variant="outline"
            className="w-full border-destructive/30 text-destructive hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive sm:w-auto"
            onClick={() => setLogoutOpen(true)}
          >
            <LogOut className="size-4" />
            تسجيل الخروج
          </Button>
        }
      />

      <FadeIn>
        <ProfileBanner
          name={profile.name}
          role={profile.role}
          avatarUrl={profile.avatarUrl}
          active
          actions={
            <Button
              variant="outline"
              className="w-full bg-card hover:bg-muted sm:w-auto"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="size-4" />
              تعديل البيانات
            </Button>
          }
        />
      </FadeIn>

      <ProfileFacts
        title="بيانات الملف"
        email={profile.email}
        phone={profile.phone}
        joinedAt={profile.joinedAt}
        role={profile.role}
      />
      <ProfilePermissions
        permissions={
          profile.permissions && profile.permissions.length > 0
            ? profile.permissions
            : ADMIN_PERMISSIONS
        }
      />
      <ProfileActivityLog entries={activity} />

      <EditProfileDialog
        open={editOpen}
        profile={profile}
        onOpenChange={setEditOpen}
      />
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </div>
  );
}
