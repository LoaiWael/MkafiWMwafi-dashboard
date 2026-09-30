import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateAdminProfile } from "@/features/profile/admin-profile-store";
import { MAX_AVATAR_BYTES } from "@/features/profile/constants";
import { profileInitials } from "@/features/profile/components/profile-banner";
import type { AdminProfile } from "@/features/profile/types";

interface EditProfileDialogProps {
  open: boolean;
  profile: AdminProfile;
  onOpenChange: (open: boolean) => void;
}

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export default function EditProfileDialog({
  open,
  profile,
  onOpenChange,
}: EditProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <EditProfileForm
          key={`${profile.name}-${profile.email}-${profile.phone}-${profile.avatarUrl.length}`}
          profile={profile}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </Dialog>
  );
}

function EditProfileForm({
  profile,
  onClose,
}: {
  profile: AdminProfile;
  onClose: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [errors, setErrors] = useState<FieldErrors>({});

  function onPickFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setErrors((current) => ({
        ...current,
        avatar: "يُقبل ملف صورة فقط.",
      }));
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      setErrors((current) => ({
        ...current,
        avatar: "حجم الصورة أكبر من 1 ميجابايت.",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatarUrl(reader.result);
        setErrors((current) => ({ ...current, avatar: undefined }));
      }
    };
    reader.readAsDataURL(file);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: FieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.replace(/\s/g, "");

    if (trimmedName.length < 2) {
      nextErrors.name = "الاسم يجب أن يكون حرفين على الأقل.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }
    if (!/^05\d{8}$/.test(trimmedPhone)) {
      nextErrors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    updateAdminProfile({
      name: trimmedName,
      email: trimmedEmail,
      phone: trimmedPhone,
      avatarUrl,
    });
    toast.success("تم حفظ بيانات الملف الشخصي");
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>تعديل بيانات الملف</DialogTitle>
        <DialogDescription>
          تحديث الاسم وبيانات التواصل والصورة. الدور يُحدد من إدارة الصلاحيات.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <Avatar className="size-16 border border-border">
            {avatarUrl ? <AvatarImage src={avatarUrl} alt="" /> : null}
            <AvatarFallback className="bg-primary/10 font-bold text-primary">
              {profileInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              تغيير الصورة
            </Button>
            {avatarUrl ? (
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  aria-label="إزالة الصورة"
                  className="inline-flex size-10 items-center justify-center rounded-full border border-border text-destructive hover:bg-destructive/10"
                  onClick={() => setAvatarUrl("")}
                >
                  <Trash2 className="size-4" />
                </TooltipTrigger>
                <TooltipContent side="top" sideOffset={6}>
                  إزالة الصورة
                </TooltipContent>
              </Tooltip>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => onPickFile(event.target.files?.[0])}
            />
          </div>
        </div>
        {errors.avatar ? (
          <p className="text-xs text-destructive">{errors.avatar}</p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="profile-name">الاسم</Label>
          <Input
            id="profile-name"
            dir="auto"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="h-10"
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <p className="text-xs text-destructive">{errors.name}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="profile-role">الدور</Label>
          <Input id="profile-role" value={profile.role} disabled className="h-10" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="profile-email">البريد الإلكتروني</Label>
            <Input
              id="profile-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? (
              <p className="text-xs text-destructive">{errors.email}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-phone">رقم الجوال</Label>
            <Input
              id="profile-phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-10"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone ? (
              <p className="text-xs text-destructive">{errors.phone}</p>
            ) : null}
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">حفظ التعديلات</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
