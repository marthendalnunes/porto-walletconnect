'use client';

import { ConfirmationDialogProvider } from '@/components/confirmation-dialog-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { type State, WagmiProvider } from 'wagmi';

import { getConfig } from '@/lib/wagmi/config';

export function RootProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <ConfirmationDialogProvider>{children}</ConfirmationDialogProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
