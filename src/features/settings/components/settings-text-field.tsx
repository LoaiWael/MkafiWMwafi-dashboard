import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SettingsTextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  dir?: "ltr" | "auto";
  multiline?: boolean;
  icon?: ReactNode;
}

export default function SettingsTextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  dir = "auto",
  multiline = false,
  icon,
}: SettingsTextFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs sm:text-sm font-medium">
        {icon}
        {label}
      </Label>
      {multiline ? (
        <Textarea
          id={id}
          dir={dir}
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <Input
          id={id}
          dir={dir}
          value={value}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground leading-relaxed">{hint}</p>
      ) : null}
    </div>
  );
}
