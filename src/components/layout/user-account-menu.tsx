import { useState } from "react";
import { ChevronDown, ChevronRight, LogOut, Settings, User } from "lucide-react";
import { Link, useLocation } from "react-router";
import LogoutDialog from "@/features/profile/components/logout-dialog";
import { profileInitials } from "@/features/profile/components/profile-banner";
import { useAdminProfile } from "@/features/profile/hooks/use-admin-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ROUTES } from "@/lib/constants";

const MENU_CHEVRON_CLASS =
  "size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180 rtl:group-hover:-translate-x-0.5";

export default function UserAccountMenu() {
  const { pathname } = useLocation();
  const { profile } = useAdminProfile();
  const [open, setOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  const displayName = profile.name || "المستخدم";
  const initials = profileInitials(displayName);

  function close() {
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label="الحساب"
        className="inline-flex h-10 cursor-pointer items-center gap-1 rounded-full border border-border bg-card ps-1 pe-2 outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring sm:max-w-60 sm:gap-2 [&[data-popup-open]_svg]:rotate-180"
      >
        <Avatar className="size-8">
          {profile.avatarUrl ? <AvatarImage src={profile.avatarUrl} alt="" /> : null}
          <AvatarFallback className="bg-primary/10 text-xs text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="hidden min-w-0 flex-1 text-start sm:block">
          <span className="block truncate text-sm font-semibold leading-tight text-foreground">
            {displayName}
          </span>
          <span className="block truncate text-xs leading-tight text-muted-foreground">
            {profile.role}
          </span>
        </span>
        <ChevronDown
          size={16}
          className="shrink-0 text-muted-foreground transition-transform"
        />
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-64 gap-0 rounded-2xl border border-border/80 bg-background/95 p-3 shadow-xl ring-0 backdrop-blur-md"
      >
        <Link
          to={ROUTES.profile}
          viewTransition
          onClick={close}
          className="group -m-0.5 flex items-center justify-between gap-3 rounded-xl border-b border-border/60 p-1.5 transition-all hover:bg-primary-50/80"
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="size-10 shrink-0 rounded-full bg-primary-gradient shadow-inner-primary">
              {profile.avatarUrl ? (
                <AvatarImage src={profile.avatarUrl} alt="" />
              ) : null}
              <AvatarFallback className="rounded-full bg-transparent font-bold text-primary-foreground">
                {initials || <User className="size-5" />}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 text-start">
              <p className="truncate text-sm font-bold text-foreground transition-colors group-hover:text-primary-900">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {profile.role}
              </p>
            </div>
          </div>
          <ChevronRight className={MENU_CHEVRON_CLASS} />
        </Link>

        <div className="mt-2 space-y-1">
          <Link
            to={ROUTES.profile}
            viewTransition
            onClick={close}
            className="group flex w-full items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-primary-50/80 hover:text-primary-900"
          >
            <div className="flex items-center gap-2.5">
              <User className="size-4 text-primary" />
              <span>الملف الشخصي</span>
            </div>
            <ChevronRight className={MENU_CHEVRON_CLASS} />
          </Link>
          <Link
            to={ROUTES.settings}
            viewTransition
            onClick={close}
            className="group flex w-full items-center justify-between gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-foreground transition-all hover:bg-primary-50/80 hover:text-primary-900"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="size-4.5 text-primary-700" />
              <span>الإعدادات</span>
            </div>
            <ChevronRight className={MENU_CHEVRON_CLASS} />
          </Link>
        </div>

        <div className="mt-2 border-t border-border/60 pt-2">
          <button
            type="button"
            onClick={() => {
              close();
              setLogoutOpen(true);
            }}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4 text-destructive" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </PopoverContent>
      <LogoutDialog open={logoutOpen} onOpenChange={setLogoutOpen} />
    </Popover>
  );
}
