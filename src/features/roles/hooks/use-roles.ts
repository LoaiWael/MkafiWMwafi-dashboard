import { useSyncExternalStore } from "react";
import { subscribeEmployees } from "@/features/employees/employees-store";
import { getRoles, subscribeRoles } from "../roles-store";

export function useRoles() {
  return useSyncExternalStore(
    (callback) => {
      const unsubRoles = subscribeRoles(callback);
      const unsubEmployees = subscribeEmployees(callback);
      return () => {
        unsubRoles();
        unsubEmployees();
      };
    },
    getRoles,
    getRoles,
  );
}
