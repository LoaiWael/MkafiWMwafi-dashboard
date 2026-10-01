import { MOCK_CUSTOMERS, type CustomerRecord } from "./constants";

let customers: readonly CustomerRecord[] = MOCK_CUSTOMERS;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getCustomers() {
  return customers;
}

export function subscribeCustomers(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setCustomerBlocked(id: string, blocked: boolean) {
  const current = customers.find((customer) => customer.id === id);
  if (!current || current.active === !blocked) return;

  customers = customers.map((customer) =>
    customer.id === id ? { ...customer, active: !blocked } : customer,
  );
  emit();
}
