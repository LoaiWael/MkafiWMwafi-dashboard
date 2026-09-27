import { createBrowserRouter } from "react-router";
import RootLayout from "@/components/layout/RootLayout";
import OverviewPage from "@/routes/dashboard/overview-page";
import ContractsPage from "@/routes/dashboard/contracts-page";
import ContractDetailsPage from "@/routes/dashboard/contract-details-page";
import RequestsPage from "@/routes/dashboard/requests-page";
import PropertiesPage from "@/routes/dashboard/properties-page";
import UsersPage from "@/routes/dashboard/users-page";
import DocumentsPage from "@/routes/dashboard/documents-page";
import PaymentsPage from "@/routes/dashboard/payments-page";
import PricingPage from "@/routes/dashboard/pricing-page";
import CouponsPage from "@/routes/dashboard/coupons-page";
import TaxesPage from "@/routes/dashboard/taxes-page";
import ReportsPage from "@/routes/dashboard/reports-page";
import NotificationsPage from "@/routes/dashboard/notifications-page";
import RegionsPage from "@/routes/dashboard/regions-page";
import UnitOptionsPage from "@/routes/dashboard/unit-options-page";
import PartyOptionsPage from "@/routes/dashboard/party-options-page";
import ContentPage from "@/routes/dashboard/content-page";
import SettingsPage from "@/routes/dashboard/settings-page";
import TermsPage from "@/routes/dashboard/terms-page";
import PrivacyPage from "@/routes/dashboard/privacy-page";
import NotFoundPage from "@/routes/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: OverviewPage },
      { path: "contracts", Component: ContractsPage },
      { path: "contracts/:id", Component: ContractDetailsPage },
      { path: "requests", Component: RequestsPage },
      { path: "properties", Component: PropertiesPage },
      { path: "users", Component: UsersPage },
      { path: "documents", Component: DocumentsPage },
      { path: "payments", Component: PaymentsPage },
      { path: "pricing", Component: PricingPage },
      { path: "coupons", Component: CouponsPage },
      { path: "taxes", Component: TaxesPage },
      { path: "reports", Component: ReportsPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "regions", Component: RegionsPage },
      { path: "unit-options", Component: UnitOptionsPage },
      { path: "party-options", Component: PartyOptionsPage },
      { path: "content", Component: ContentPage },
      { path: "terms", Component: TermsPage },
      { path: "privacy", Component: PrivacyPage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
