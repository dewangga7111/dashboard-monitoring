import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Edit Division - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function DivisionLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider functionId={constants.menu.DIVISION.functionId} access={constants.permission.UPDATE}>
      {children}
    </RouteGuardProvider>
  );
}
