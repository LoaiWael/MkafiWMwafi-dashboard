import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  type Control,
  Controller,
  type FieldErrors,
  type UseFormRegister,
} from "react-hook-form";
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
import type { EmployeeFormData } from "../schemas/employee-schema";

interface EmployeeFormFieldsProps {
  register: UseFormRegister<EmployeeFormData>;
  control: Control<EmployeeFormData>;
  errors: FieldErrors<EmployeeFormData>;
  roleOptions: readonly string[];
  disabled?: boolean;
}

export default function EmployeeFormFields({
  register,
  control,
  errors,
  roleOptions,
  disabled = false,
}: EmployeeFormFieldsProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const passwordToggleLabel = passwordVisible
    ? "إخفاء كلمة المرور"
    : "إظهار كلمة المرور";

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="employee-name">
          الاسم <span className="text-destructive">*</span>
        </Label>
        <Input
          id="employee-name"
          dir="auto"
          disabled={disabled}
          className="h-10"
          aria-invalid={Boolean(errors.name)}
          {...register("name")}
        />
        {errors.name ? (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee-role">
          الدور الوظيفي <span className="text-destructive">*</span>
        </Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select
              value={field.value}
              onValueChange={field.onChange}
              disabled={disabled}
            >
              <SelectTrigger
                id="employee-role"
                aria-label="الدور الوظيفي"
                className="h-10 w-full cursor-pointer"
                aria-invalid={Boolean(errors.role)}
              >
                <SelectValue placeholder="اختر الدور">
                  {field.value || "اختر الدور"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="start">
                {roleOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.role ? (
          <p className="text-xs text-destructive">{errors.role.message}</p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employee-email">
            البريد الإلكتروني <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employee-email"
            type="email"
            dir="ltr"
            disabled={disabled}
            className="h-10"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="employee-phone">
            رقم الجوال <span className="text-destructive">*</span>
          </Label>
          <Input
            id="employee-phone"
            type="tel"
            dir="ltr"
            disabled={disabled}
            className="h-10"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          {errors.phone ? (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employee-password">
          كلمة المرور <span className="text-destructive">*</span>
        </Label>
        <div dir="ltr" className="relative">
          <Input
            id="employee-password"
            type={passwordVisible ? "text" : "password"}
            autoComplete="new-password"
            disabled={disabled}
            className="h-10 pe-12"
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
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
          <p className="text-xs text-destructive">{errors.password.message}</p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 rounded-lg border border-border p-3">
        <Label htmlFor="employee-active" className="cursor-pointer">
          الحساب نشط
        </Label>
        <Controller
          control={control}
          name="active"
          render={({ field }) => (
            <Switch
              id="employee-active"
              checked={field.value}
              onCheckedChange={field.onChange}
              disabled={disabled}
            />
          )}
        />
      </div>
    </>
  );
}
