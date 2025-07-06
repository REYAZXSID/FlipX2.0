import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { UserDataProvider } from '@/context/UserDataContext';

export const metadata: Metadata = {
  title: 'FlipFun',
  description: 'A fun card matching game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Lilita+One&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="font-body antialiased theme-bg-default">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserDataProvider>
            {children}
            <Toaster />
          </UserDataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
