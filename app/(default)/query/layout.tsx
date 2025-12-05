import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Query - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function QueryLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider pageId={constants.menu.MENU_ID_QUERY} access={constants.permission.READ}>
      <div className="w-full">
        {children}
      </div>
    </RouteGuardProvider>
  );
}
