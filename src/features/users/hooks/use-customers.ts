import { useSyncExternalStore } from "react";
import {
  getCustomers,
  subscribeCustomers,
} from "@/features/users/customers-store";

export function useCustomers() {
  return useSyncExternalStore(subscribeCustomers, getCustomers, getCustomers);
}

export function useCustomer(id: string | undefined) {
  const customers = useCustomers();
  if (!id) return undefined;
  return customers.find((customer) => customer.id === id);
}
