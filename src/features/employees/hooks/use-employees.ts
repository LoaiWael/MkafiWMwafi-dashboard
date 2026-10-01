import { useSyncExternalStore } from "react";
import {
  getEmployees,
  subscribeEmployees,
} from "@/features/employees/employees-store";

export function useEmployees() {
  return useSyncExternalStore(subscribeEmployees, getEmployees, getEmployees);
}

export function useEmployee(id: string | undefined) {
  const employees = useEmployees();
  if (!id) return undefined;
  return employees.find((employee) => employee.id === id);
}
