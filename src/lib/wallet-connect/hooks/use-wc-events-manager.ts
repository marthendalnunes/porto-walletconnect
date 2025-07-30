import { useConfirmationDialog } from '@/components/confirmation-dialog-provider';
import { supportedChains } from '@/lib/wagmi/config';
import { createEmitter } from '@/lib/wagmi/emitter';
import type { WalletKitTypes } from '@reown/walletkit';
import { useQueryClient } from '@tanstack/react-query';
import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils';
import { useCallback, useEffect, useMemo } from 'react';
import { type ConnectorEventMap, useConnectors } from 'wagmi';

import { useWalletKitClient } from './use-wallet-kit-client';

const emitter = createEmitter<ConnectorEventMap>(crypto.randomUUID());

export function useWcEventsManager(initialized: boolean) {
  const { openDialog } = useConfirmationDialog();
  const { data: walletKitClient } = useWalletKitClient();
  const connectors = useConnectors();
  const queryClient = useQueryClient();
  const portoConnector = useMemo(
    () =>
      connectors.length === 1
        ? {
            ...connectors[0],
            emitter,
          }
        : undefined,
    [connectors],
  );

  // Callbacks for WalletConnect events
  const onSessionProposal = useCallback(
    async ({ id, params }: WalletKitTypes.SessionProposal) => {
      try {
        if (!walletKitClient) {
          throw new Error('WalletKit client not initialized');
        }

        if (!portoConnector) {
          throw new Error('portoConnector not initialized');
        }

        const accounts = await portoConnector.getAccounts();

        // ------- namespaces builder util ------------ //
        const approvedNamespaces = buildApprovedNamespaces({
          proposal: params,
          supportedNamespaces: {
            eip155: {
              // TODO: refactor to get all supported chains
              chains: supportedChains.map(({ id }) => `eip155:${id}`),
              methods: [
                'eth_sendTransaction',
                'personal_sign',
                'eth_signTypedData_v4',
                'wallet_sendCalls',
              ],
              events: ['accountsChanged', 'chainChanged'],
              accounts:
                accounts?.flatMap((account) =>
                  supportedChains.map(({ id }) => `eip155:${id}:${account}`),
                ) ?? [],
            },
          },
        });
        // ------- end namespaces builder util ------------ //
        console.log('Approved namespaces', approvedNamespaces);

        await walletKitClient.approveSession({
          id,
          namespaces: approvedNamespaces,
        });

        // Invalidate active connections query to update the UI
        await queryClient.invalidateQueries({
          queryKey: ['wc-active-connections'],
        });
      } catch (_error) {
        if (!walletKitClient) {
          return;
        }
        // use the error.message to show toast / info - box letting the user know that the connection attempt was unsuccessful
        await walletKitClient.rejectSession({
          id: params.id,
          reason: getSdkError('USER_REJECTED'),
        });
      }
    },
    [walletKitClient, queryClient],
  );
  const onSessionDelete = useCallback(async () => {
    // Invalidate active connections query to update the UI
    await queryClient.invalidateQueries({
      queryKey: ['wc-active-connections'],
    });
  }, [queryClient]);
  const onSessionRequest = useCallback(
    async (event: WalletKitTypes.SessionRequest) => {
      try {
        if (!walletKitClient) {
          throw new Error('WalletKit client not initialized');
        }

        if (!portoConnector) {
          throw new Error('portoConnector not initialized');
        }

        const provider = await portoConnector.getProvider();
        const { topic, params: eventParams, id } = event;
        const { request, chainId: rawChainId } = eventParams;
        const chainId = Number(rawChainId.replace('eip155:', ''));
        const { method, params } = request;

        // If the chain is unsupported, reject the request
        if (
          !supportedChainIds.some(
            (supportedChainId) => supportedChainId === chainId,
          )
        ) {
          return await walletKitClient.respondSessionRequest({
            topic,
            response: {
              id,
              error: getSdkError('UNSUPPORTED_CHAINS'),
              jsonrpc: '2.0',
            },
          });
        }

        const dialogConfirmed = await openDialog();
        if (dialogConfirmed) {
          const result = await provider?.request({
            method,
            params,
          });

          await walletKitClient.respondSessionRequest({
            topic,
            response: { id, result, jsonrpc: '2.0' },
          });
        } else {
          await walletKitClient.respondSessionRequest({
            topic,
            response: {
              id,
              error: getSdkError('USER_REJECTED'),
              jsonrpc: '2.0',
            },
          });
        }
      } catch (error) {
        console.error('Error handling session request', error);
      }
    },
    [walletKitClient, , openDialog],
  );

  // Set up WalletConnect event listeners
  useEffect(() => {
    console.log('WalletConnect event listeners initialized');
    console.log('WalletKit client', walletKitClient);
    console.log('Initialized', initialized);
    if (!initialized || !walletKitClient) {
      return;
    }

    walletKitClient.on('session_proposal', onSessionProposal);
    walletKitClient.on('session_delete', onSessionDelete);
    walletKitClient.on('session_request', onSessionRequest);

    return () => {
      walletKitClient.off('session_proposal', onSessionProposal);
      walletKitClient.off('session_delete', onSessionDelete);
      walletKitClient.off('session_request', onSessionRequest);
    };
  }, [
    walletKitClient,
    initialized,
    onSessionProposal,
    onSessionDelete,
    onSessionRequest,
  ]);
}
