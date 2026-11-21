import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const publicPath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const metadata: Metadata = {
  title: 'Risk Lab | Shore Wash',
  description: 'Explore portfolio value at risk using an archived instrument-price snapshot',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href={publicPath + '/oc/assets/icons/shore-wash-icon-light.png'}
          data-dark-href={publicPath + '/oc/assets/icons/shore-wash-icon-dark.png'} />
        <script defer src={publicPath + '/oc/scripts/oc-ai-controls.js'} />
        <script src={publicPath + '/oc/styles/oc-ai-theme.js'} />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
