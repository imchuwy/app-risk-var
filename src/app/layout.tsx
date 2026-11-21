import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const publicPath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  icons: publicPath + '/oc/assets/icons/favicon.svg',
  title: 'Risk Lab | OC AI',
  description: 'Explore one-day portfolio value at risk with simulated returns',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src={publicPath + '/oc/styles/oc-ai-theme.js'} />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
