export type NotificationType = "system" | "employee" | "role";

export interface NotificationSender {
  name: string;
  role: string;
  avatarUrl?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
  sender?: NotificationSender;
  href?: string;
}
