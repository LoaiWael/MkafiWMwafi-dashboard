import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import {
  EMPLOYEE_ROLES,
  type EmployeeRecord,
} from "../constants";
import {
  employeeSchema,
  type EmployeeFormData,
} from "../schemas/employee-schema";
import EmployeeFormFields from "./employee-form-fields";

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

  const roleOptions =
    employee && !(EMPLOYEE_ROLES as readonly string[]).includes(employee.role)
      ? [employee.role, ...EMPLOYEE_ROLES]
      : [...EMPLOYEE_ROLES];

  const defaultValues: EmployeeFormData = {
    name: employee?.name ?? "",
    role: employee?.role ?? EMPLOYEE_ROLES[0],
    email: employee?.email ?? "",
    phone: employee?.phone ?? "",
    password: employee?.password ?? "",
    active: employee?.active ?? true,
  };

  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues,
  });

  function onSubmit(data: EmployeeFormData) {
    const input: EmployeeInput = {
      name: data.name.trim(),
      role: data.role,
      email: data.email.trim(),
      phone: data.phone.replace(/\s/g, ""),
      password: data.password.trim(),
      active: data.active,
    };

    const message = employee
      ? updateEmployee(employee.id, input)
      : createEmployee(input);

    if (message) {
      setError("root", { message });
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

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <EmployeeFormFields
          register={register}
          control={control}
          errors={errors}
          roleOptions={roleOptions}
          disabled={isSubmitting}
        />

        {errors.root?.message ? (
          <p role="alert" className="text-xs text-destructive">
            {errors.root.message}
          </p>
        ) : null}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
          >
            إلغاء
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEditing ? "حفظ التعديلات" : "إضافة الموظف"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
