import { STORAGE_KEYS } from "@/lib/constants";
import {
  ADMIN_ACTIVITY,
  DEFAULT_ADMIN_PROFILE,
} from "@/features/profile/constants";
import type { AdminProfile, ProfileActivity } from "@/features/profile/types";

export interface AdminProfilePatch {
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
}

interface AdminState {
  profile: AdminProfile;
  activity: ProfileActivity[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function readProfile(): AdminProfile {
  if (typeof localStorage === "undefined") return DEFAULT_ADMIN_PROFILE;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.adminProfile);
    if (!raw) return DEFAULT_ADMIN_PROFILE;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return DEFAULT_ADMIN_PROFILE;

    return {
      name: readString(parsed.name, DEFAULT_ADMIN_PROFILE.name),
      role: DEFAULT_ADMIN_PROFILE.role,
      avatarUrl: readString(parsed.avatarUrl, ""),
      email: readString(parsed.email, DEFAULT_ADMIN_PROFILE.email),
      phone: readString(parsed.phone, DEFAULT_ADMIN_PROFILE.phone),
      joinedAt: DEFAULT_ADMIN_PROFILE.joinedAt,
    };
  } catch {
    return DEFAULT_ADMIN_PROFILE;
  }
}

function formatStamp(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

let state: AdminState = {
  profile: readProfile(),
  activity: [...ADMIN_ACTIVITY],
};

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getAdminState() {
  return state;
}

export function subscribeAdminState(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function updateAdminProfile(patch: AdminProfilePatch) {
  const profile: AdminProfile = {
    ...state.profile,
    name: patch.name.trim(),
    email: patch.email.trim(),
    phone: patch.phone.trim(),
    avatarUrl: patch.avatarUrl,
  };

  const entry: ProfileActivity = {
    id: `act-${Date.now()}`,
    action: "تحديث بيانات الملف الشخصي",
    detail: "تم حفظ الاسم وبيانات التواصل والصورة.",
    at: formatStamp(new Date()),
  };

  state = {
    profile,
    activity: [entry, ...state.activity].slice(0, 20),
  };

  localStorage.setItem(STORAGE_KEYS.adminProfile, JSON.stringify(profile));
  emit();
}
