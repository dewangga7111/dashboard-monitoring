import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Access Denied - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function ForbiddenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{children}</>
  );
}
