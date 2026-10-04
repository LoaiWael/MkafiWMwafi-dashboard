import { useState, useEffect } from "react";
import type { NotificationItem } from "../types";
import { INITIAL_NOTIFICATIONS } from "../constants";

const NOTIFICATIONS_CHANGE_EVENT = "makfiwamufi:notifications-changed";

let inMemoryNotifications: NotificationItem[] = [...INITIAL_NOTIFICATIONS];

function getNotifications(): NotificationItem[] {
  return inMemoryNotifications;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(getNotifications);

  useEffect(() => {
    function handleSync() {
      setNotifications(getNotifications());
    }

    window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, handleSync);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, handleSync);
    };
  }, []);

  function save(newItems: NotificationItem[]) {
    inMemoryNotifications = newItems;
    setNotifications(newItems);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(NOTIFICATIONS_CHANGE_EVENT));
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAsRead(id: string) {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    save(updated);
  }

  function markAllAsRead() {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    save(updated);
  }

  function deleteNotification(id: string) {
    const updated = notifications.filter((n) => n.id !== id);
    save(updated);
  }

  function clearAll() {
    save([]);
  }

  function restoreDefaults() {
    save([...INITIAL_NOTIFICATIONS]);
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    restoreDefaults,
  };
}
