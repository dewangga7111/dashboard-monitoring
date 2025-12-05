import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Dashboard - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider pageId={constants.menu.MENU_ID_DASHBOARD} access={constants.permission.READ}>
      {children}
    </RouteGuardProvider>
  );
}
