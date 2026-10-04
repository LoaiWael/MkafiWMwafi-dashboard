import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { logoutAdmin } from "@/features/auth/auth-store";
import { ROUTES } from "@/lib/constants";

interface LogoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const navigate = useNavigate();

  function confirmLogout() {
    onOpenChange(false);
    logoutAdmin();
    toast.success("تم تسجيل الخروج من لوحة التحكم");
    navigate(ROUTES.login, { viewTransition: true });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>تسجيل الخروج</DialogTitle>
          <DialogDescription>
            إنهاء الجلسة الحالية في لوحة التحكم. يمكن تسجيل الدخول لاحقاً من
            شاشة الدخول.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            البقاء
          </Button>
          <Button variant="destructive" onClick={confirmLogout}>
            تسجيل الخروج
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
