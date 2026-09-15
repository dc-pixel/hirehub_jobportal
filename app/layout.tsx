import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HireHub | Find your next opportunity',
  description: 'A modern job portal for candidates and recruiters.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
