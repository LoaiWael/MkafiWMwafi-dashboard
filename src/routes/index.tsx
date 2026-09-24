import { createBrowserRouter } from "react-router";
import RootLayout from "@/components/layout/RootLayout";
import OverviewPage from "@/routes/dashboard/overview-page";
import ContractsPage from "@/routes/dashboard/contracts-page";
import RequestsPage from "@/routes/dashboard/requests-page";
import PropertiesPage from "@/routes/dashboard/properties-page";
import UsersPage from "@/routes/dashboard/users-page";
import BrokersPage from "@/routes/dashboard/brokers-page";
import PaymentsPage from "@/routes/dashboard/payments-page";
import LicensesPage from "@/routes/dashboard/licenses-page";
import ReportsPage from "@/routes/dashboard/reports-page";
import NotificationsPage from "@/routes/dashboard/notifications-page";
import SupportPage from "@/routes/dashboard/support-page";
import SettingsPage from "@/routes/dashboard/settings-page";
import NotFoundPage from "@/routes/not-found-page";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: OverviewPage },
      { path: "contracts", Component: ContractsPage },
      { path: "requests", Component: RequestsPage },
      { path: "properties", Component: PropertiesPage },
      { path: "users", Component: UsersPage },
      { path: "brokers", Component: BrokersPage },
      { path: "payments", Component: PaymentsPage },
      { path: "licenses", Component: LicensesPage },
      { path: "reports", Component: ReportsPage },
      { path: "notifications", Component: NotificationsPage },
      { path: "support", Component: SupportPage },
      { path: "settings", Component: SettingsPage },
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
