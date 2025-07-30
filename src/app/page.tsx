'use client';
import { ConnectWc } from '@/components/connect-wc';
import { ActiveWcSessions } from '@/components/wc/active-wc-sessions';
import { useWcAccountsSync } from '@/lib/wallet-connect/hooks/use-wc-accounts-sync';
import { useWcEventsManager } from '@/lib/wallet-connect/hooks/use-wc-events-manager';
import { useAccount } from 'wagmi';

export default function Home() {
  // TODO: Move wc logic to a separate component
  const { isConnected } = useAccount();
  useWcEventsManager(isConnected);
  useWcAccountsSync();

  return (
    <div className="mx-auto flex h-screen w-full max-w-5xl flex-col items-center justify-center gap-16">
      <main className="row-start-2 flex flex-col items-center gap-8">
        <h2 className="text-center font-medium text-4xl">
          Porto + WalletConnect
        </h2>
        <div className="flex flex-col gap-12">
          <ConnectWc />
          <ActiveWcSessions />
        </div>
      </main>
    </div>
  );
}
