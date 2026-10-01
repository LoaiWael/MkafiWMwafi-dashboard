import {
  MOCK_EMPLOYEES,
  permissionsForRole,
  type EmployeeRecord,
} from "./constants";

export interface EmployeeInput {
  name: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
}

let employees: readonly EmployeeRecord[] = MOCK_EMPLOYEES;

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

export function getEmployees() {
  return employees;
}

export function subscribeEmployees(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function setEmployeeActive(id: string, active: boolean) {
  const current = employees.find((employee) => employee.id === id);
  if (!current || current.active === active) return;

  employees = employees.map((employee) =>
    employee.id === id ? { ...employee, active } : employee,
  );
  emit();
}

function emailTaken(email: string, exceptId?: string) {
  const normalized = email.trim().toLowerCase();
  return employees.some(
    (employee) =>
      employee.id !== exceptId &&
      employee.email.trim().toLowerCase() === normalized,
  );
}

function nextEmployeeId() {
  const max = employees.reduce((highest, employee) => {
    const value = Number(employee.id.replace(/^emp-/, ""));
    return Number.isFinite(value) ? Math.max(highest, value) : highest;
  }, 0);
  return `emp-${String(max + 1).padStart(3, "0")}`;
}

function formatJoinedAt(date: Date) {
  return new Intl.DateTimeFormat("ar", {
    numberingSystem: "latn",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatActivityAt(date: Date) {
  const day = formatJoinedAt(date);
  const time = new Intl.DateTimeFormat("ar", {
    numberingSystem: "latn",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  return `${day}، ${time}`;
}

export function createEmployee(input: EmployeeInput) {
  if (emailTaken(input.email)) {
    return "هذا البريد مستخدم لحساب موظف آخر.";
  }

  const now = new Date();
  const id = nextEmployeeId();
  const record: EmployeeRecord = {
    id,
    name: input.name.trim(),
    role: input.role,
    avatarUrl: "",
    email: input.email.trim(),
    phone: input.phone,
    password: input.password,
    active: input.active,
    joinedAt: formatJoinedAt(now),
    joinedAtIso: now.toISOString().slice(0, 10),
    permissions: [...permissionsForRole(input.role)],
    activity: [
      {
        id: `${id}-created`,
        action: "إنشاء الحساب",
        detail: "تم إنشاء حساب الموظف من لوحة التحكم.",
        at: formatActivityAt(now),
      },
    ],
  };

  employees = [record, ...employees];
  emit();
  return null;
}

export function updateEmployee(id: string, input: EmployeeInput) {
  const current = employees.find((employee) => employee.id === id);
  if (!current) return "الموظف غير موجود.";
  if (emailTaken(input.email, id)) {
    return "هذا البريد مستخدم لحساب موظف آخر.";
  }

  employees = employees.map((employee) =>
    employee.id === id
      ? {
          ...employee,
          name: input.name.trim(),
          role: input.role,
          email: input.email.trim(),
          phone: input.phone,
          password: input.password,
          active: input.active,
          permissions: [...permissionsForRole(input.role)],
        }
      : employee,
  );
  emit();
  return null;
}
