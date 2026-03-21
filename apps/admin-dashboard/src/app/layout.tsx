import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restro QR - Admin Dashboard',
  description: 'Restaurant management dashboard for Restro QR platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface-secondary">{children}</body>
    </html>
  );
}
