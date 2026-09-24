import NotificationsSection from "@/features/notifications/components/notifications-section";
import { useDocumentTitle } from "@/hooks/use-document-title";

export default function NotificationsPage() {
  useDocumentTitle("الإشعارات");

  return <NotificationsSection />;
}
