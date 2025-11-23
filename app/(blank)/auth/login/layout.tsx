import { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Login - ' + process.env.NEXT_PUBLIC_WEB_TITLE,
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{children}</>
  );
}
