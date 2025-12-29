import './globals.css';
import localFont from 'next/font/local';
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ClientProviders } from '@/providers/ClientProviders';
import type { Metadata } from 'next';

const geist = localFont({
  src: [
    { path: '../public/geist/static/Geist-Regular.ttf', weight: '400', style: 'normal' },
    { path: '../public/geist/static/Geist-Bold.ttf', weight: '700', style: 'normal' },
  ],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="at">
      <body className={`${geist.variable} dark:bg-gray-900 antialiased`}>
        <ClientProviders>
          <ThemeProvider>
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
