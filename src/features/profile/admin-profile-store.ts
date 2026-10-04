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

function formatStamp(date: Date) {
  return new Intl.DateTimeFormat("ar-SA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

let state: AdminState = {
  profile: { ...DEFAULT_ADMIN_PROFILE },
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

  emit();
}
