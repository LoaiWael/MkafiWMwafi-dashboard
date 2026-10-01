import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CustomerRecord } from "@/features/users/constants";
import UserBlockAction from "./user-block-action";
import UserNotifyDialog from "./user-notify-dialog";

interface UserBannerActionsProps {
  customer: CustomerRecord;
}

export default function UserBannerActions({ customer }: UserBannerActionsProps) {
  const [notifyOpen, setNotifyOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setNotifyOpen(true)}>
        <Bell className="size-4" />
        إرسال إشعار
      </Button>
      <UserBlockAction customer={customer} />
      <UserNotifyDialog
        open={notifyOpen}
        userName={customer.name}
        onOpenChange={setNotifyOpen}
      />
    </>
  );
}
