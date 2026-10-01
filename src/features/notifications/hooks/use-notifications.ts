import { useState, useEffect } from "react";
import type { NotificationItem } from "../types";
import { INITIAL_NOTIFICATIONS, NOTIFICATIONS_STORAGE_KEY } from "../constants";

const NOTIFICATIONS_CHANGE_EVENT = "makfiwamufi:notifications-changed";

function getStoredNotifications(): NotificationItem[] {
  if (typeof window === "undefined") return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback to initial
  }
  return INITIAL_NOTIFICATIONS;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);

  useEffect(() => {
    function handleSync() {
      setNotifications(getStoredNotifications());
    }

    window.addEventListener(NOTIFICATIONS_CHANGE_EVENT, handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener(NOTIFICATIONS_CHANGE_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  function save(newItems: NotificationItem[]) {
    setNotifications(newItems);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newItems));
      window.dispatchEvent(new Event(NOTIFICATIONS_CHANGE_EVENT));
    } catch {
      // ignore
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
    save(INITIAL_NOTIFICATIONS);
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
