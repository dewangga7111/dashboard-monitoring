import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Dashboard Overview - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function DashboardOverviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider functionId={constants.menu.DASHBOARD.functionId} access={constants.permission.READ}>
      <div className="w-full">
        {children}
      </div>
    </RouteGuardProvider>
  );
}
