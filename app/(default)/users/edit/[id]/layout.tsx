import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Edit Users - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider pageId={constants.menu.MENU_ID_USER} access={constants.permission.UPDATE}>
      {children}
    </RouteGuardProvider>
  );
}
