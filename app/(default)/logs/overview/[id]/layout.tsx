import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Logs Overview - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function LogsOverviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider functionId={constants.menu.LOGS.functionId} access={constants.permission.READ}>
      {children}
    </RouteGuardProvider>
  );
}
