import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Division - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function DivisionLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider pageId={constants.menu.MENU_ID_DIVISION} access={constants.permission.READ}>
      <div className='3xl:w-[60%]'>
        {children}
      </div>
    </RouteGuardProvider>
  );
}
