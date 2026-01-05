import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arizona Demographics Map',
  description: 'Interactive map of Arizona counties with demographic data',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
