// import { Geist, Geist_Mono } from "next/font/google";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import BootstrapClient from '@/components/bootstrap-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'wagebait',
  description: 'Generated by create next app',
  icons: [
    {
      media: '(prefers-color-scheme: light)',
      url: '/favicon/icon-light.png',
      href: '/favicon/icon-light.png',
    },
    {
      media: '(prefers-color-scheme: dark)',
      url: '/favicon/icon-dark.png',
      href: '/favicon/icon-dark.png',
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      >
        {children}
      </body>
      <BootstrapClient />
    </html>
  );
}
