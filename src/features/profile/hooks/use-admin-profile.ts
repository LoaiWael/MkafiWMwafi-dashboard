import { useSyncExternalStore } from "react";
import {
  getAdminState,
  subscribeAdminState,
} from "@/features/profile/admin-profile-store";

export function useAdminProfile() {
  return useSyncExternalStore(subscribeAdminState, getAdminState, getAdminState);
}
