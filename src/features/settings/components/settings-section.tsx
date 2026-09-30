import { useState, type FormEvent } from "react";
import { ImageIcon, Phone, Search, Share2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import PageHeader from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import BrandPanel from "@/features/settings/components/brand-panel";
import ContactsPanel from "@/features/settings/components/contacts-panel";
import SeoPanel from "@/features/settings/components/seo-panel";
import SocialPanel from "@/features/settings/components/social-panel";
import { SETTINGS_TAB_IDS } from "@/features/settings/constants";
import { readSystemSettings, trimSystemSettings, writeSystemSettings } from "@/features/settings/storage";
import {
  SETTINGS_TABS,
  type SettingsFieldErrors,
  type SettingsTab,
  type SiteSeo,
  type SocialNetwork,
  type SystemSettings,
} from "@/features/settings/types";
import {
  firstSettingsErrorTab,
  hasSettingsErrors,
  validateSystemSettings,
} from "@/features/settings/validate";
import { useUrlTab } from "@/hooks/use-url-tab";

const SETTINGS_TAB_ITEMS: FilterTabItem<SettingsTab>[] = [
  { id: SETTINGS_TABS.brand, label: "الهوية", icon: ImageIcon },
  { id: SETTINGS_TABS.contacts, label: "التواصل", icon: Phone },
  { id: SETTINGS_TABS.social, label: "الروابط", icon: Share2 },
  { id: SETTINGS_TABS.seo, label: "ظهور الموقع", icon: Search },
];

export default function SettingsSection() {
  const [settings, setSettings] = useState(readSystemSettings);
  const [savedSettings, setSavedSettings] = useState(settings);
  const [errors, setErrors] = useState<SettingsFieldErrors>({});
  const [tab, setTab] = useUrlTab<SettingsTab>({
    paramKey: "tab",
    defaultValue: SETTINGS_TABS.brand,
    validValues: SETTINGS_TAB_IDS,
  });

  const isUnchanged = JSON.stringify(settings) === JSON.stringify(savedSettings);

  function clearError(key: keyof SettingsFieldErrors) {
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  }

  function patchSettings(patch: Partial<SystemSettings>) {
    setSettings((current) => ({ ...current, ...patch }));
    for (const key of Object.keys(patch) as (keyof SystemSettings)[]) {
      if (key in errors) clearError(key as keyof SettingsFieldErrors);
    }
  }

  function patchSocial(network: SocialNetwork, url: string) {
    setSettings((current) => ({
      ...current,
      social: { ...current.social, [network]: url },
    }));
    clearError(network);
  }

  function patchSeo(patch: Partial<SiteSeo>) {
    setSettings((current) => ({ ...current, seo: { ...current.seo, ...patch } }));
    if (patch.title !== undefined) clearError("seoTitle");
    if (patch.titleTemplate !== undefined) clearError("titleTemplate");
    if (patch.description !== undefined) clearError("seoDescription");
    if (patch.siteUrl !== undefined) clearError("siteUrl");
    if (patch.canonicalPath !== undefined) clearError("canonicalPath");
    if (patch.ogImageAlt !== undefined) clearError("ogImageAlt");
    if (patch.twitterTitle !== undefined) clearError("twitterTitle");
    if (patch.twitterDescription !== undefined) clearError("twitterDescription");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = trimSystemSettings(settings);
    const nextErrors = validateSystemSettings(next);
    setErrors(nextErrors);
    if (hasSettingsErrors(nextErrors)) {
      const errorTab = firstSettingsErrorTab(nextErrors);
      if (errorTab) setTab(errorTab);
      toast.error("يرجى مراجعة الحقول وتصحيح الأخطاء");
      return;
    }

    // After the settings API is wired, replace this local write with toast.promise
    // so loading, success, and error share one toast:
    // toast.promise(saveSystemSettings(next), {
    //   loading: "جاري حفظ الإعدادات",
    //   success: "تم حفظ الإعدادات",
    //   error: "تعذّر حفظ الإعدادات",
    // });
    try {
      writeSystemSettings(next);
    } catch {
      toast.error("تعذّر حفظ الإعدادات. جرّب صوراً أصغر.");
      return;
    }

    setSettings(next);
    setSavedSettings(next);
    toast.success("تم حفظ الإعدادات");
  }

  return (
    <div className="page-shell space-y-4 sm:space-y-6 py-4 sm:py-6 md:py-8">
      <PageHeader
        title="إعدادات النظام"
        description="هوية المنصة، وبيانات التواصل، وروابط الشبكات، وبيانات ظهور الموقع الرئيسي في محركات البحث."
      />

      <FilterTabs
        items={SETTINGS_TAB_ITEMS}
        value={tab}
        onValueChange={setTab}
        layout="auto"
        gridColsClass="sm:grid-cols-4"
        ariaLabel="أقسام إعدادات النظام"
        idPrefix="settings-tab"
      />

      <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            role="tabpanel"
            id={`panel-${tab}`}
            aria-labelledby={`settings-tab-${tab}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="rounded-xl sm:rounded-2xl border border-border bg-card p-3.5 sm:p-6 shadow-xs"
          >
            {tab === SETTINGS_TABS.brand ? (
              <BrandPanel values={settings} errors={errors} onChange={patchSettings} />
            ) : null}
            {tab === SETTINGS_TABS.contacts ? (
              <ContactsPanel values={settings} errors={errors} onChange={patchSettings} />
            ) : null}
            {tab === SETTINGS_TABS.social ? (
              <SocialPanel values={settings} errors={errors} onChange={patchSocial} />
            ) : null}
            {tab === SETTINGS_TABS.seo ? (
              <SeoPanel
                siteName={settings.name}
                seo={settings.seo}
                errors={errors}
                onChange={patchSeo}
              />
            ) : null}
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-1 sm:pt-0">
          <Button type="submit" disabled={isUnchanged} className="w-full sm:w-auto">
            حفظ الإعدادات
          </Button>
        </div>
      </form>
    </div>
  );
}
