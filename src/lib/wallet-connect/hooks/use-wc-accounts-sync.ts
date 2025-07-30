import { useEffect, useMemo } from 'react';
import type { Address } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import { supportedChainIds } from '@/lib/wagmi/config';
import { useWalletKitClient } from './use-wallet-kit-client';

/**
 * Hook for handling account changes from Porto accounts with WalletConnect.
 */
export function useWcAccountsSync() {
  const { data: walletKitClient } = useWalletKitClient();
  const { address, connector } = useAccount();
  const chainId = useChainId();

  const portoAccount = useMemo(() => {
    if (!address) return;

    return address;
  }, [address, connector]);

  // Call the onAccountChange callback when the account changes.
  useEffect(() => {
    if (!walletKitClient || !portoAccount) return;

    async function updateWalletAccount(portoAccount: Address) {
      if (!walletKitClient) return;
      const sessions = Object.values(walletKitClient.getActiveSessions());

      if (sessions.length === 0) return;

      for (const session of sessions) {
        const previousNamespaces = session.namespaces;
        const namespaces = {
          ...previousNamespaces,
          eip155: {
            ...previousNamespaces.eip155,
            accounts: supportedChainIds.map(
              (chainId) => `eip155:${chainId}:${portoAccount}`,
            ),
          },
        };
        await Promise.all([
          walletKitClient.updateSession({
            topic: session.topic,
            namespaces,
          }),
          walletKitClient.emitSessionEvent({
            topic: session.topic,
            event: { name: 'accountsChanged', data: [portoAccount] },
            chainId: `eip155:${chainId}`,
          }),
        ]);
      }
    }

    updateWalletAccount(portoAccount).catch(console.error);
  }, [chainId, walletKitClient, portoAccount]);

  return portoAccount;
}
