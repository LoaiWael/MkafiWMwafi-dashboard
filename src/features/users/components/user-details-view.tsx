import { ArrowRight, Building2, FileText, IdCard } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";
import { FadeIn } from "@/components/animations";
import { FilterTabs, type FilterTabItem } from "@/components/ui/filter-tabs";
import ProfileActivityLog from "@/features/profile/components/profile-activity-log";
import ProfileBanner from "@/features/profile/components/profile-banner";
import ProfileBreadcrumb from "@/features/profile/components/profile-breadcrumb";
import ProfileFacts from "@/features/profile/components/profile-facts";
import ProfileMissing from "@/features/profile/components/profile-missing";
import {
  activityForCustomer,
  propertiesForCustomer,
} from "@/features/users/customer-relations";
import {
  USER_DETAIL_TAB,
  USER_DETAIL_TAB_PARAM,
  USER_DETAIL_TABS,
  type UserDetailTab,
} from "@/features/users/constants";
import { useCustomer } from "@/features/users/hooks/use-customers";
import { useUserContracts } from "@/features/users/hooks/use-user-contracts";
import { useUrlTab } from "@/hooks/use-url-tab";
import { ROUTES } from "@/lib/constants";
import UserBannerActions from "./user-banner-actions";
import UserContractsPanel from "./user-contracts-panel";
import UserPropertiesPanel from "./user-properties-panel";

interface UserDetailsViewProps {
  userId: string | undefined;
}

const PANEL_MOTION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

export default function UserDetailsView({ userId }: UserDetailsViewProps) {
  const customer = useCustomer(userId);
  const contractsState = useUserContracts(userId ?? "");
  const [activeTab, setActiveTab] = useUrlTab<UserDetailTab>({
    paramKey: USER_DETAIL_TAB_PARAM,
    defaultValue: USER_DETAIL_TAB.facts,
    validValues: USER_DETAIL_TABS,
    clearDefaultFromUrl: true,
  });

  if (!customer) {
    return (
      <div className="page-shell space-y-6 py-6 sm:py-8">
        <ProfileMissing
          title="العميل غير موجود"
          description="لا يوجد حساب عميل بهذا المعرّف."
          backTo={ROUTES.users}
          backLabel="العودة إلى العملاء"
        />
      </div>
    );
  }

  const contracts = contractsState.contracts;
  const properties = propertiesForCustomer(customer);
  const activity = activityForCustomer(customer.id);

  const tabs: FilterTabItem<UserDetailTab>[] = [
    {
      id: USER_DETAIL_TAB.facts,
      label: "البيانات",
      icon: IdCard,
    },
    {
      id: USER_DETAIL_TAB.contracts,
      label: "العقود",
      icon: FileText,
      count: contracts.length,
    },
    {
      id: USER_DETAIL_TAB.properties,
      label: "العقارات",
      icon: Building2,
      count: properties.length,
    },
  ];

  return (
    <div className="page-shell space-y-6 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProfileBreadcrumb
          items={[
            { label: "الرئيسية", to: ROUTES.home },
            { label: "العملاء", to: ROUTES.users },
            { label: customer.name },
          ]}
        />
        <Link
          to={ROUTES.users}
          viewTransition
          className="inline-flex h-10 items-center gap-1.5 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground hover:bg-muted"
        >
          <ArrowRight className="size-4" />
          العودة إلى العملاء
        </Link>
      </div>

      <FadeIn>
        <ProfileBanner
          name={customer.name}
          role={customer.role}
          avatarUrl={customer.avatarUrl}
          kindLabel="حساب عميل"
          active={customer.active}
          activeLabel="الحساب غير محظور"
          actions={<UserBannerActions customer={customer} />}
        />
      </FadeIn>

      <FilterTabs
        items={tabs}
        value={activeTab}
        onValueChange={setActiveTab}
        paramKey={USER_DETAIL_TAB_PARAM}
        defaultValue={USER_DETAIL_TAB.facts}
        clearDefaultFromUrl
        layout="grid"
        gridColsClass="grid-cols-1 sm:grid-cols-3"
        ariaLabel="أقسام ملف العميل"
        idPrefix="user-detail"
      />

      <AnimatePresence mode="wait">
        {activeTab === USER_DETAIL_TAB.facts ? (
          <motion.div
            key={USER_DETAIL_TAB.facts}
            role="tabpanel"
            id={`panel-${USER_DETAIL_TAB.facts}`}
            aria-labelledby={`user-detail-${USER_DETAIL_TAB.facts}`}
            className="space-y-6"
            {...PANEL_MOTION}
          >
            <ProfileFacts
              title="بيانات العميل"
              email={customer.email}
              phone={customer.phone}
              joinedAt={customer.joinedAt}
              role={customer.role}
              roleLabel="الصفة"
              idPrefix={customer.id}
            />
            <ProfileActivityLog entries={activity} />
          </motion.div>
        ) : null}

        {activeTab === USER_DETAIL_TAB.contracts ? (
          <motion.div
            key={USER_DETAIL_TAB.contracts}
            role="tabpanel"
            id={`panel-${USER_DETAIL_TAB.contracts}`}
            aria-labelledby={`user-detail-${USER_DETAIL_TAB.contracts}`}
            {...PANEL_MOTION}
          >
            <UserContractsPanel {...contractsState} />
          </motion.div>
        ) : null}

        {activeTab === USER_DETAIL_TAB.properties ? (
          <motion.div
            key={USER_DETAIL_TAB.properties}
            role="tabpanel"
            id={`panel-${USER_DETAIL_TAB.properties}`}
            aria-labelledby={`user-detail-${USER_DETAIL_TAB.properties}`}
            {...PANEL_MOTION}
          >
            <UserPropertiesPanel properties={properties} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
