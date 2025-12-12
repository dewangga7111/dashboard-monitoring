import { Metadata } from 'next';
import { RouteGuardProvider } from "@/context/route-guard-context";
import constants from "@/utils/constants"

export const metadata: Metadata = {
  title: 'Users - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuardProvider functionId={constants.menu.USERS.functionId} access={constants.permission.READ}>
      <div className='3xl:w-[60%]'>
        {children}
      </div>
    </RouteGuardProvider>
  );
}
