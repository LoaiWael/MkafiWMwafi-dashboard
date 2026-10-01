import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface EmployeeFieldErrors {
  name?: string;
  role?: string;
  email?: string;
  phone?: string;
  password?: string;
  form?: string;
}

interface EmployeeFormFieldsProps {
  name: string;
  role: string;
  email: string;
  phone: string;
  password: string;
  active: boolean;
  roleOptions: readonly string[];
  errors: EmployeeFieldErrors;
  onNameChange: (value: string) => void;
  onRoleChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onActiveChange: (value: boolean) => void;
}

export default function EmployeeFormFields({
  name,
  role,
  email,
  phone,
  password,
  active,
  roleOptions,
  errors,
  onNameChange,
  onRoleChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onActiveChange,
}: EmployeeFormFieldsProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordToggleLabel = passwordVisible
    ? "إخفاء كلمة المرور"
    : "إظهار كلمة المرور";

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="employee-name">الاسم</Label>
        <Input
          id="employee-name"
          dir="auto"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          className="h-10"
          aria-invalid={Boolean(errors.name)}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee-role">الدور الوظيفي</Label>
        <Select value={role} onValueChange={(value) => onRoleChange(value ?? "")}>
          <SelectTrigger
            id="employee-role"
            aria-label="الدور الوظيفي"
            className="h-10 w-full cursor-pointer"
            aria-invalid={Boolean(errors.role)}
          >
            <SelectValue>{role || "اختر الدور"}</SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            {roleOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.role ? (
          <p className="text-xs text-destructive">{errors.role}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employee-email">البريد الإلكتروني</Label>
          <Input
            id="employee-email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            className="h-10"
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="employee-phone">رقم الجوال</Label>
          <Input
            id="employee-phone"
            type="tel"
            dir="ltr"
            value={phone}
            onChange={(event) => onPhoneChange(event.target.value)}
            className="h-10"
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee-password">كلمة المرور</Label>
        <div dir="ltr" className="relative">
          <Input
            id="employee-password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="new-password"
            value={password}
            onChange={(event) => onPasswordChange(event.target.value)}
            className="h-10 pe-12"
            aria-invalid={Boolean(errors.password)}
          />
          <Tooltip>
            <TooltipTrigger
              type="button"
              aria-label={passwordToggleLabel}
              className="absolute end-1 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setPasswordVisible((current) => !current)}
            >
              {passwordVisible ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={6}>
              {passwordToggleLabel}
            </TooltipContent>
          </Tooltip>
        </div>
        {errors.password ? (
          <p className="text-xs text-destructive">{errors.password}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
        <Label htmlFor="employee-active" className="cursor-pointer">
          الحساب نشط
        </Label>
        <Switch
          id="employee-active"
          checked={active}
          onCheckedChange={(value) => onActiveChange(Boolean(value))}
        />
      </div>
    </>
  );
}
