import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import AdminLayoutClient from '@/components/AdminLayoutClient';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export const metadata: Metadata = {
  title: 'Admin Operations Console | Afro Dream Global',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  const isAuthenticated = (await verifyAdminSessionToken(token)) !== null;

  return (
    <AdminLayoutClient initialAuthenticated={isAuthenticated}>
      {children}
    </AdminLayoutClient>
  );
}
