import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import { cookieToInitialState } from 'wagmi';

import { getConfig } from '../lib/wagmi/config';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Porto WalletConnect',
  description: 'Connect porto via WalletConnect',
};

export default function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    headers().get('cookie'),
  );
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers initialState={initialState}>
          {props.children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
