import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Server Overview - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function ServerOverviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider pageId={constants.menu.MENU_ID_SERVER} access={constants.permission.READ}>
      <div className="w-full">
        {children}
      </div>
    </RouteGuardProvider>
  );
}
