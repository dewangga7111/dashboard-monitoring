import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Edit Roles - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function RolesLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider pageId={constants.menu.MENU_ID_ROLE} access={constants.permission.UPDATE}>
      {children}
    </RouteGuardProvider>
  );
}
