import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  createEmployee,
  updateEmployee,
  type EmployeeInput,
} from "@/features/employees/employees-store";
import { EMPLOYEE_ROLES, MIN_EMPLOYEE_PASSWORD_LENGTH, type EmployeeRecord } from "../constants";
import EmployeeFormFields, {
  type EmployeeFieldErrors,
} from "./employee-form-fields";

interface EmployeeDialogProps {
  open: boolean;
  employee?: EmployeeRecord | null;
  onOpenChange: (open: boolean) => void;
}

export default function EmployeeDialog({
  open,
  employee,
  onOpenChange,
}: EmployeeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open ? (
        <EmployeeForm
          key={employee?.id ?? "new"}
          employee={employee}
          onClose={() => onOpenChange(false)}
        />
      ) : null}
    </Dialog>
  );
}

function EmployeeForm({
  employee,
  onClose,
}: {
  employee?: EmployeeRecord | null;
  onClose: () => void;
}) {
  const isEditing = Boolean(employee);
  const [name, setName] = useState(employee?.name ?? "");
  const [role, setRole] = useState(employee?.role ?? EMPLOYEE_ROLES[0]);
  const [email, setEmail] = useState(employee?.email ?? "");
  const [phone, setPhone] = useState(employee?.phone ?? "");
  const [password, setPassword] = useState(employee?.password ?? "");
  const [active, setActive] = useState(employee?.active ?? true);
  const [errors, setErrors] = useState<EmployeeFieldErrors>({});

  const roleOptions =
    employee && !(EMPLOYEE_ROLES as readonly string[]).includes(employee.role)
      ? [employee.role, ...EMPLOYEE_ROLES]
      : [...EMPLOYEE_ROLES];

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: EmployeeFieldErrors = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.replace(/\s/g, "");
    const trimmedPassword = password.trim();

    if (trimmedName.length < 2) {
      nextErrors.name = "الاسم يجب أن يكون حرفين على الأقل.";
    }
    if (!role.trim()) {
      nextErrors.role = "اختر الدور الوظيفي.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }
    if (!/^05\d{8}$/.test(trimmedPhone)) {
      nextErrors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام.";
    }
    if (trimmedPassword.length < MIN_EMPLOYEE_PASSWORD_LENGTH) {
      nextErrors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input: EmployeeInput = {
      name: trimmedName,
      role,
      email: trimmedEmail,
      phone: trimmedPhone,
      password: trimmedPassword,
      active,
    };

    const message = employee
      ? updateEmployee(employee.id, input)
      : createEmployee(input);

    if (message) {
      setErrors({ form: message });
      return;
    }

    toast.success(employee ? "تم حفظ بيانات الموظف" : "تمت إضافة الموظف");
    onClose();
  }

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "تعديل بيانات الموظف" : "إضافة موظف"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "تحديث الاسم والدور وبيانات التواصل وكلمة المرور. صلاحيات الحساب تتبع الدور."
            : "إنشاء حساب موظف جديد مع الدور وبيانات التواصل وكلمة المرور. صلاحيات الحساب تتبع الدور."}
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={onSubmit} className="space-y-4">
        <EmployeeFormFields
          name={name}
          role={role}
          email={email}
          phone={phone}
          password={password}
          active={active}
          roleOptions={roleOptions}
          errors={errors}
          onNameChange={setName}
          onRoleChange={setRole}
          onEmailChange={setEmail}
          onPhoneChange={setPhone}
          onPasswordChange={setPassword}
          onActiveChange={setActive}
        />

        {errors.form ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.form}
          </p>
        ) : null}

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit">
            {isEditing ? "حفظ التعديلات" : "إضافة الموظف"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
