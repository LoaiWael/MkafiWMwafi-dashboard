import SettingsTextField from "@/features/settings/components/settings-text-field";
import type { SettingsFieldErrors, SystemSettings } from "@/features/settings/types";

interface ContactsPanelProps {
  values: SystemSettings;
  errors: SettingsFieldErrors;
  onChange: (patch: Partial<SystemSettings>) => void;
}

export default function ContactsPanel({ values, errors, onChange }: ContactsPanelProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
        <SettingsTextField
          id="settings-email"
          label="البريد الإلكتروني"
          value={values.email}
          error={errors.email}
          dir="ltr"
          placeholder="info@makfiwamufi.sa"
          onChange={(email) => onChange({ email })}
        />
        <SettingsTextField
          id="settings-phone"
          label="رقم التواصل"
          value={values.phone}
          error={errors.phone}
          dir="ltr"
          placeholder="0504111307"
          onChange={(phone) => onChange({ phone })}
        />
      </div>
      <SettingsTextField
        id="settings-opening-hours"
        label="أوقات العمل"
        value={values.openingHours}
        error={errors.openingHours}
        hint="يُكتب كنص حر، مثل أيام الدوام وساعاته، ويظهر في الموقع كما هو."
        multiline
        onChange={(openingHours) => onChange({ openingHours })}
      />
      <SettingsTextField
        id="settings-copyright"
        label="حقوق النشر"
        value={values.copyright}
        error={errors.copyright}
        hint="النص الذي يظهر أسفل الموقع."
        onChange={(copyright) => onChange({ copyright })}
      />
    </div>
  );
}
