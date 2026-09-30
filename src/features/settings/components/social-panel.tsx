import type { IconType } from "react-icons";
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from "react-icons/fa6";
import SettingsTextField from "@/features/settings/components/settings-text-field";
import { SOCIAL_FIELDS } from "@/features/settings/constants";
import {
  SOCIAL_NETWORKS,
  type SettingsFieldErrors,
  type SocialNetwork,
  type SystemSettings,
} from "@/features/settings/types";

const SOCIAL_ICONS = {
  [SOCIAL_NETWORKS.linkedin]: FaLinkedinIn,
  [SOCIAL_NETWORKS.x]: FaXTwitter,
  [SOCIAL_NETWORKS.youtube]: FaYoutube,
  [SOCIAL_NETWORKS.instagram]: FaInstagram,
} as const satisfies Record<SocialNetwork, IconType>;

interface SocialPanelProps {
  values: SystemSettings;
  errors: SettingsFieldErrors;
  onChange: (network: SocialNetwork, url: string) => void;
}

export default function SocialPanel({ values, errors, onChange }: SocialPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-3.5 sm:gap-4 sm:grid-cols-2">
      {SOCIAL_FIELDS.map((field) => {
        const Icon = SOCIAL_ICONS[field.key];
        return (
          <SettingsTextField
            key={field.key}
            id={`settings-social-${field.key}`}
            label={field.label}
            icon={<Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden />}
            value={values.social[field.key]}
            error={errors[field.key]}
            dir="ltr"
            placeholder={field.placeholder}
            hint="اترك الحقل فارغاً لإخفاء الرابط."
            onChange={(url) => onChange(field.key, url)}
          />
        );
      })}
    </div>
  );
}
