import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Restro QR - Order Food Instantly',
  description: 'Scan, Order, Enjoy. The fastest way to order food from your favorite restaurants.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        {children}
      </body>
    </html>
  );
}
