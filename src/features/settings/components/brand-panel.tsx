import { Wrench } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SettingsImageField from "@/features/settings/components/settings-image-field";
import SettingsTextField from "@/features/settings/components/settings-text-field";
import type { SettingsFieldErrors, SystemSettings } from "@/features/settings/types";

interface BrandPanelProps {
  values: SystemSettings;
  errors: SettingsFieldErrors;
  onChange: (patch: Partial<SystemSettings>) => void;
}

const LOGO_ACCEPT = "image/svg+xml,image/png,image/webp";
const FAVICON_ACCEPT = "image/svg+xml,image/png,image/x-icon,.ico";
const PHOTO_ACCEPT = "image/png,image/jpeg,image/webp";

export default function BrandPanel({ values, errors, onChange }: BrandPanelProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2.5 sm:gap-3 rounded-xl border border-border bg-muted/30 p-3 sm:p-4 transition-colors">
        <div className="flex items-start gap-2.5 sm:gap-3">
          <Checkbox
            id="settings-under-maintenance"
            checked={Boolean(values.underMaintenance)}
            onCheckedChange={(checked) => onChange({ underMaintenance: Boolean(checked) })}
            className="mt-0.5"
          />
          <div className="space-y-1 select-none">
            <Label
              htmlFor="settings-under-maintenance"
              className="flex cursor-pointer items-center gap-2 font-medium text-foreground text-xs sm:text-sm"
            >
              <Wrench className="size-3.5 sm:size-4 text-muted-foreground" />
              وضع الصيانة (Under Maintenance)
            </Label>
            <p className="text-xs text-muted-foreground leading-relaxed">
              عند تفعيل هذا الخيار، يتم إيقاف الموقع للزوار مؤقتاً وعرض صفحة الصيانة والتحديث.
            </p>
          </div>
        </div>
        {values.underMaintenance ? (
          <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-medium text-amber-600 dark:text-amber-400">
            <span>تنبيه: وضع الصيانة مفعّل حالياً للمنصة.</span>
          </div>
        ) : null}
      </div>

      <SettingsTextField
        id="settings-name"
        label="اسم المنصة"
        value={values.name}
        error={errors.name}
        onChange={(name) => onChange({ name })}
      />
      <SettingsTextField
        id="settings-description"
        label="الوصف المختصر"
        value={values.description}
        error={errors.description}
        hint="يظهر تحت الشعار في تذييل الموقع."
        multiline
        onChange={(description) => onChange({ description })}
      />
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
        <SettingsImageField
          id="settings-logo"
          label="الشعار"
          value={values.logo}
          accept={LOGO_ACCEPT}
          shape="square"
          hint="شعار المنصة بصيغة SVG أو PNG."
          error={errors.logo}
          onChange={(logo) => onChange({ logo })}
        />
        <SettingsImageField
          id="settings-favicon"
          label="أيقونة الموقع"
          value={values.favicon}
          accept={FAVICON_ACCEPT}
          shape="square"
          hint="تظهر في تبويب المتصفح."
          error={errors.favicon}
          onChange={(favicon) => onChange({ favicon })}
        />
        <SettingsImageField
          id="settings-primary-image"
          label="الصورة الأساسية"
          value={values.primaryImage}
          accept={PHOTO_ACCEPT}
          hint="الصورة الرئيسية للمنصة في الموقع."
          onChange={(primaryImage) => onChange({ primaryImage })}
        />
        <SettingsImageField
          id="settings-secondary-image"
          label="الصورة الثانوية"
          value={values.secondaryImage}
          accept={PHOTO_ACCEPT}
          hint="صورة مساندة تُستخدم إلى جانب الصورة الأساسية."
          onChange={(secondaryImage) => onChange({ secondaryImage })}
        />
      </div>
    </div>
  );
}
