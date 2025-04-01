// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import Providers from './Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Nexto - Book Your Flights',
  description: 'Find and book flights to destinations worldwide with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
