import { useState, type FormEvent } from "react";
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
import { Textarea } from "@/components/ui/textarea";

const MIN_NOTIFY_TEXT_LENGTH = 2;

interface UserNotifyDialogProps {
  open: boolean;
  userName: string;
  onOpenChange: (open: boolean) => void;
}

interface NotifyFieldErrors {
  title?: string;
  description?: string;
}

export default function UserNotifyDialog({
  open,
  userName,
  onOpenChange,
}: UserNotifyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <UserNotifyForm userName={userName} onClose={() => onOpenChange(false)} />
      ) : null}
    </Dialog>
  );
}

function UserNotifyForm({
  userName,
  onClose,
}: {
  userName: string;
  onClose: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<NotifyFieldErrors>({});

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: NotifyFieldErrors = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (trimmedTitle.length < MIN_NOTIFY_TEXT_LENGTH) {
      nextErrors.title = "العنوان يجب أن يكون حرفين على الأقل.";
    }
    if (trimmedDescription.length < MIN_NOTIFY_TEXT_LENGTH) {
      nextErrors.description = "الوصف يجب أن يكون حرفين على الأقل.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    toast.success(`تم إرسال الإشعار إلى ${userName}`);
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>إرسال إشعار</DialogTitle>
        <DialogDescription>
          إرسال رسالة إلى {userName} بعنوان ووصف.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="user-notify-title">العنوان</Label>
          <Input
            id="user-notify-title"
            dir="auto"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-10"
            aria-invalid={Boolean(errors.title)}
          />
          {errors.title ? (
            <p className="text-xs text-destructive">{errors.title}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="user-notify-description">الوصف</Label>
          <Textarea
            id="user-notify-description"
            dir="auto"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-24"
            aria-invalid={Boolean(errors.description)}
          />
          {errors.description ? (
            <p className="text-xs text-destructive">{errors.description}</p>
          ) : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">إرسال</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
